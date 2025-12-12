# 📚 Panduan Menambahkan Resource Baru

Dokumentasi step-by-step untuk menambahkan resource/fitur baru pada boilerplate Genta.

---

## 📋 Overview

Proyek ini menggunakan arsitektur monorepo dengan struktur:

```
├── apps/
│   ├── backend/     # Go + Echo
│   └── frontend/    # React + TanStack
├── packages/
│   ├── openapi/     # API Contract (ts-rest)
│   └── zod/         # Shared Zod schemas
```

**Alur penambahan resource baru:**

1. Database Migration
2. Zod Schema (shared validation)
3. OpenAPI Contract
4. Backend (Model → Repository → Service → Handler → Router)
5. Frontend API Integration

---

## Step 1: Database Migration

### 1.1 Buat file migration baru

```bash
# Di folder apps/backend
touch internal/database/migrations/002_add_[resource_name].sql
```

### 1.2 Tulis SQL migration

```sql
-- File: internal/database/migrations/002_add_products.sql
-- Contoh: menambahkan tabel products

-- Write your migrate up statements here
```

CREATE TABLE products (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(255) NOT NULL,
description TEXT,
price DECIMAL(10, 2) NOT NULL,
stock INTEGER DEFAULT 0,
is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP

);

-- Indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Trigger untuk auto-update updated_at
CREATE TRIGGER trigger_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

---- create above / drop below ----

-- Write your migrate down statements here
DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
DROP TABLE IF EXISTS products;

````

### 1.3 Jalankan migration

```bash
cd apps/backend
task migrate:up
````

---

## Step 2: Zod Schema (packages/zod)

### 2.1 Buat file schema baru

```bash
# Di folder packages/zod/src
touch src/product.ts
```

### 2.2 Definisikan Zod schema

```typescript
// File: packages/zod/src/product.ts
import { z } from "zod";

// Base schema
export const ZProduct = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Request schemas
export const ZCreateProductRequest = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0).default(0),
});

export const ZUpdateProductRequest = ZCreateProductRequest.partial();

// Response schemas
export const ZProductResponse = ZProduct;

export const ZProductListResponse = z.object({
  data: z.array(ZProduct),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    has_next: z.boolean(),
    has_prev: z.boolean(),
  }),
});

// Query params
export const ZProductQueryParams = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
});
```

### 2.3 Export dari index.ts

```typescript
// File: packages/zod/src/index.ts
import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export * from "./utils.js";
export * from "./health.js";
export * from "./product.js"; // Tambahkan ini
```

### 2.4 Build package

```bash
cd packages/zod
pnpm build
```

---

## Step 3: OpenAPI Contract (packages/openapi)

### 3.1 Buat file contract baru

```bash
# Di folder packages/openapi/src/contracts
touch src/contracts/product.ts
```

### 3.2 Definisikan API contract

```typescript
// File: packages/openapi/src/contracts/product.ts
import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ZProduct,
  ZProductResponse,
  ZProductListResponse,
  ZCreateProductRequest,
  ZUpdateProductRequest,
  ZProductQueryParams,
} from "@genta/zod";
import { getSecurityMetadata } from "@/utils.js";

const c = initContract();

export const productContract = c.router({
  // GET /api/v1/products
  listProducts: {
    summary: "List all products",
    path: "/api/v1/products",
    method: "GET",
    description: "Get paginated list of products",
    query: ZProductQueryParams,
    responses: {
      200: ZProductListResponse,
    },
    metadata: getSecurityMetadata(), // Jika perlu auth
  },

  // GET /api/v1/products/:id
  getProduct: {
    summary: "Get product by ID",
    path: "/api/v1/products/:id",
    method: "GET",
    description: "Get a single product by ID",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      200: ZProductResponse,
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // POST /api/v1/products
  createProduct: {
    summary: "Create a new product",
    path: "/api/v1/products",
    method: "POST",
    description: "Create a new product",
    body: ZCreateProductRequest,
    responses: {
      201: ZProductResponse,
      400: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // PUT /api/v1/products/:id
  updateProduct: {
    summary: "Update a product",
    path: "/api/v1/products/:id",
    method: "PUT",
    description: "Update an existing product",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: ZUpdateProductRequest,
    responses: {
      200: ZProductResponse,
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // DELETE /api/v1/products/:id
  deleteProduct: {
    summary: "Delete a product",
    path: "/api/v1/products/:id",
    method: "DELETE",
    description: "Soft delete a product",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: {
      204: z.undefined(),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },
});
```

### 3.3 Register contract di index.ts

```typescript
// File: packages/openapi/src/contracts/index.ts
import { initContract } from "@ts-rest/core";
import { healthContract } from "./health.js";
import { productContract } from "./product.js"; // Tambahkan ini

const c = initContract();

export const apiContract = c.router({
  Health: healthContract,
  Product: productContract, // Tambahkan ini
});
```

### 3.4 Generate OpenAPI spec

```bash
cd packages/openapi
pnpm build
```

---

## Step 4: Backend Implementation

### 4.1 Model

```bash
# Di folder apps/backend/internal/model
touch product.go
```

```go
// File: internal/model/product.go
package model

import (
    "time"
    "github.com/google/uuid"
    "github.com/shopspring/decimal"
)

type Product struct {
    ID          uuid.UUID       `json:"id" db:"id"`
    Name        string          `json:"name" db:"name"`
    Description *string         `json:"description,omitempty" db:"description"`
    Price       decimal.Decimal `json:"price" db:"price"`
    Stock       int             `json:"stock" db:"stock"`
    IsActive    bool            `json:"is_active" db:"is_active"`
    CreatedAt   time.Time       `json:"created_at" db:"created_at"`
    UpdatedAt   time.Time       `json:"updated_at" db:"updated_at"`
    DeletedAt   *time.Time      `json:"-" db:"deleted_at"`
}

type CreateProductRequest struct {
    Name        string          `json:"name" validate:"required,max=255"`
    Description *string         `json:"description"`
    Price       decimal.Decimal `json:"price" validate:"required,gt=0"`
    Stock       int             `json:"stock" validate:"gte=0"`
}

type UpdateProductRequest struct {
    Name        *string          `json:"name" validate:"omitempty,max=255"`
    Description *string          `json:"description"`
    Price       *decimal.Decimal `json:"price" validate:"omitempty,gt=0"`
    Stock       *int             `json:"stock" validate:"omitempty,gte=0"`
    IsActive    *bool            `json:"is_active"`
}

type ProductQueryParams struct {
    Page     int    `query:"page" validate:"gte=1"`
    Limit    int    `query:"limit" validate:"gte=1,lte=100"`
    Search   string `query:"search"`
    IsActive *bool  `query:"is_active"`
}

func (r *CreateProductRequest) Validate() error { return nil }
func (r *UpdateProductRequest) Validate() error { return nil }
func (r *ProductQueryParams) Validate() error   { return nil }
```

### 4.2 Repository

```bash
# Di folder apps/backend/internal/repository
touch product.go
```

```go
// File: internal/repository/product.go
package repository

import (
    "context"
    "github.com/google/uuid"
    "github.com/jackc/pgx/v5/pgxpool"
    "github.com/manikandareas/genta/internal/model"
)

type ProductRepository struct {
    db *pgxpool.Pool
}

func NewProductRepository(db *pgxpool.Pool) *ProductRepository {
    return &ProductRepository{db: db}
}

func (r *ProductRepository) Create(ctx context.Context, req *model.CreateProductRequest) (*model.Product, error) {
    query := `
        INSERT INTO products (name, description, price, stock)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, description, price, stock, is_active, created_at, updated_at
    `

    var product model.Product
    err := r.db.QueryRow(ctx, query,
        req.Name, req.Description, req.Price, req.Stock,
    ).Scan(
        &product.ID, &product.Name, &product.Description,
        &product.Price, &product.Stock, &product.IsActive,
        &product.CreatedAt, &product.UpdatedAt,
    )

    if err != nil {
        return nil, err
    }
    return &product, nil
}

func (r *ProductRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Product, error) {
    query := `
        SELECT id, name, description, price, stock, is_active, created_at, updated_at
        FROM products
        WHERE id = $1 AND deleted_at IS NULL
    `

    var product model.Product
    err := r.db.QueryRow(ctx, query, id).Scan(
        &product.ID, &product.Name, &product.Description,
        &product.Price, &product.Stock, &product.IsActive,
        &product.CreatedAt, &product.UpdatedAt,
    )

    if err != nil {
        return nil, err
    }
    return &product, nil
}

func (r *ProductRepository) List(ctx context.Context, params *model.ProductQueryParams) ([]model.Product, int, error) {
    // Count total
    countQuery := `SELECT COUNT(*) FROM products WHERE deleted_at IS NULL`
    var total int
    if err := r.db.QueryRow(ctx, countQuery).Scan(&total); err != nil {
        return nil, 0, err
    }

    // Get paginated data
    offset := (params.Page - 1) * params.Limit
    query := `
        SELECT id, name, description, price, stock, is_active, created_at, updated_at
        FROM products
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
    `

    rows, err := r.db.Query(ctx, query, params.Limit, offset)
    if err != nil {
        return nil, 0, err
    }
    defer rows.Close()

    var products []model.Product
    for rows.Next() {
        var p model.Product
        if err := rows.Scan(
            &p.ID, &p.Name, &p.Description,
            &p.Price, &p.Stock, &p.IsActive,
            &p.CreatedAt, &p.UpdatedAt,
        ); err != nil {
            return nil, 0, err
        }
        products = append(products, p)
    }

    return products, total, nil
}

func (r *ProductRepository) Update(ctx context.Context, id uuid.UUID, req *model.UpdateProductRequest) (*model.Product, error) {
    query := `
        UPDATE products
        SET name = COALESCE($2, name),
            description = COALESCE($3, description),
            price = COALESCE($4, price),
            stock = COALESCE($5, stock),
            is_active = COALESCE($6, is_active)
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, name, description, price, stock, is_active, created_at, updated_at
    `

    var product model.Product
    err := r.db.QueryRow(ctx, query,
        id, req.Name, req.Description, req.Price, req.Stock, req.IsActive,
    ).Scan(
        &product.ID, &product.Name, &product.Description,
        &product.Price, &product.Stock, &product.IsActive,
        &product.CreatedAt, &product.UpdatedAt,
    )

    if err != nil {
        return nil, err
    }
    return &product, nil
}

func (r *ProductRepository) Delete(ctx context.Context, id uuid.UUID) error {
    query := `UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
    _, err := r.db.Exec(ctx, query, id)
    return err
}
```

### 4.3 Update repositories.go

```go
// File: internal/repository/repositories.go
package repository

import "github.com/manikandareas/genta/internal/server"

type Repositories struct {
    Product *ProductRepository
}

func NewRepositories(s *server.Server) *Repositories {
    return &Repositories{
        Product: NewProductRepository(s.DB.Pool),
    }
}
```

### 4.4 Service

```bash
# Di folder apps/backend/internal/service
touch product.go
```

```go
// File: internal/service/product.go
package service

import (
    "context"
    "github.com/google/uuid"
    "github.com/manikandareas/genta/internal/model"
    "github.com/manikandareas/genta/internal/repository"
    "github.com/manikandareas/genta/internal/server"
)

type ProductService struct {
    server *server.Server
    repo   *repository.ProductRepository
}

func NewProductService(s *server.Server, repo *repository.ProductRepository) *ProductService {
    return &ProductService{
        server: s,
        repo:   repo,
    }
}

func (s *ProductService) Create(ctx context.Context, req *model.CreateProductRequest) (*model.Product, error) {
    return s.repo.Create(ctx, req)
}

func (s *ProductService) GetByID(ctx context.Context, id uuid.UUID) (*model.Product, error) {
    return s.repo.GetByID(ctx, id)
}

func (s *ProductService) List(ctx context.Context, params *model.ProductQueryParams) ([]model.Product, int, error) {
    return s.repo.List(ctx, params)
}

func (s *ProductService) Update(ctx context.Context, id uuid.UUID, req *model.UpdateProductRequest) (*model.Product, error) {
    return s.repo.Update(ctx, id, req)
}

func (s *ProductService) Delete(ctx context.Context, id uuid.UUID) error {
    return s.repo.Delete(ctx, id)
}
```

### 4.5 Update services.go

```go
// File: internal/service/services.go
package service

import (
    "github.com/manikandareas/genta/internal/lib/job"
    "github.com/manikandareas/genta/internal/repository"
    "github.com/manikandareas/genta/internal/server"
)

type Services struct {
    Auth    *AuthService
    Job     *job.JobService
    Product *ProductService // Tambahkan ini
}

func NewServices(s *server.Server, repos *repository.Repositories) (*Services, error) {
    authService := NewAuthService(s)
    productService := NewProductService(s, repos.Product) // Tambahkan ini

    return &Services{
        Job:     s.Job,
        Auth:    authService,
        Product: productService, // Tambahkan ini
    }, nil
}
```

### 4.6 Handler

```bash
# Di folder apps/backend/internal/handler
touch product.go
```

```go
// File: internal/handler/product.go
package handler

import (
    "net/http"

    "github.com/google/uuid"
    "github.com/labstack/echo/v4"
    "github.com/manikandareas/genta/internal/errs"
    "github.com/manikandareas/genta/internal/model"
    "github.com/manikandareas/genta/internal/server"
    "github.com/manikandareas/genta/internal/service"
)

type ProductHandler struct {
    Handler
    service *service.ProductService
}

func NewProductHandler(s *server.Server, svc *service.ProductService) *ProductHandler {
    return &ProductHandler{
        Handler: NewHandler(s),
        service: svc,
    }
}

func (h *ProductHandler) List(c echo.Context, req model.ProductQueryParams) (*model.PaginatedResponse[model.Product], error) {
    products, total, err := h.service.List(c.Request().Context(), &req)
    if err != nil {
        return nil, errs.NewInternalServerError("Failed to fetch products")
    }

    totalPages := (total + req.Limit - 1) / req.Limit

    return &model.PaginatedResponse[model.Product]{
        Data:       products,
        Page:       req.Page,
        Limit:      req.Limit,
        Total:      total,
        TotalPages: totalPages,
    }, nil
}

func (h *ProductHandler) GetByID(c echo.Context, req model.ProductIDRequest) (*model.Product, error) {
    product, err := h.service.GetByID(c.Request().Context(), req.ID)
    if err != nil {
        return nil, errs.NewNotFoundError("Product not found")
    }
    return product, nil
}

func (h *ProductHandler) Create(c echo.Context, req model.CreateProductRequest) (*model.Product, error) {
    product, err := h.service.Create(c.Request().Context(), &req)
    if err != nil {
        return nil, errs.NewInternalServerError("Failed to create product")
    }
    return product, nil
}

func (h *ProductHandler) Update(c echo.Context, req model.UpdateProductWithIDRequest) (*model.Product, error) {
    product, err := h.service.Update(c.Request().Context(), req.ID, &req.UpdateProductRequest)
    if err != nil {
        return nil, errs.NewNotFoundError("Product not found")
    }
    return product, nil
}

func (h *ProductHandler) Delete(c echo.Context, req model.ProductIDRequest) error {
    if err := h.service.Delete(c.Request().Context(), req.ID); err != nil {
        return errs.NewNotFoundError("Product not found")
    }
    return nil
}

// Request types untuk path params
type ProductIDRequest struct {
    ID uuid.UUID `param:"id" validate:"required"`
}

func (r *ProductIDRequest) Validate() error { return nil }

type UpdateProductWithIDRequest struct {
    ID uuid.UUID `param:"id" validate:"required"`
    model.UpdateProductRequest
}

func (r *UpdateProductWithIDRequest) Validate() error { return nil }
```

### 4.7 Update handlers.go

```go
// File: internal/handler/handlers.go
package handler

import (
    "github.com/manikandareas/genta/internal/server"
    "github.com/manikandareas/genta/internal/service"
)

type Handlers struct {
    Health  *HealthHandler
    OpenAPI *OpenAPIHandler
    Product *ProductHandler // Tambahkan ini
}

func NewHandlers(s *server.Server, services *service.Services) *Handlers {
    return &Handlers{
        Health:  NewHealthHandler(s),
        OpenAPI: NewOpenAPIHandler(s),
        Product: NewProductHandler(s, services.Product), // Tambahkan ini
    }
}
```

### 4.8 Router

```bash
# Di folder apps/backend/internal/router
touch product.go
```

```go
// File: internal/router/product.go
package router

import (
    "net/http"

    "github.com/labstack/echo/v4"
    "github.com/manikandareas/genta/internal/handler"
    "github.com/manikandareas/genta/internal/middleware"
    "github.com/manikandareas/genta/internal/model"
)

func registerProductRoutes(g *echo.Group, h *handler.Handlers, m *middleware.Middlewares) {
    products := g.Group("/products")

    // Public routes (jika ada)
    products.GET("", handler.Handle(
        h.Product.Handler,
        h.Product.List,
        http.StatusOK,
        model.ProductQueryParams{Page: 1, Limit: 10},
    ))

    products.GET("/:id", handler.Handle(
        h.Product.Handler,
        h.Product.GetByID,
        http.StatusOK,
        handler.ProductIDRequest{},
    ))

    // Protected routes (dengan auth middleware)
    protected := products.Group("")
    protected.Use(m.Auth.RequireAuth())

    protected.POST("", handler.Handle(
        h.Product.Handler,
        h.Product.Create,
        http.StatusCreated,
        model.CreateProductRequest{},
    ))

    protected.PUT("/:id", handler.Handle(
        h.Product.Handler,
        h.Product.Update,
        http.StatusOK,
        handler.UpdateProductWithIDRequest{},
    ))

    protected.DELETE("/:id", handler.HandleNoContent(
        h.Product.Handler,
        h.Product.Delete,
        http.StatusNoContent,
        handler.ProductIDRequest{},
    ))
}
```

### 4.9 Update router.go

```go
// File: internal/router/router.go (tambahkan di bagian register versioned routes)

// register versioned routes
v1 := router.Group("/api/v1")
registerProductRoutes(v1, h, middlewares) // Tambahkan ini
```

---

## Step 5: Frontend API Integration

### 5.1 Buat API client

```bash
# Di folder apps/frontend/src/api
touch product.ts
```

```typescript
// File: apps/frontend/src/api/product.ts
import { apiClient } from "./index";

export const productApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.Product.listProducts({
      query: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
      },
    });
    return response;
  },

  getById: async (id: string) => {
    const response = await apiClient.Product.getProduct({
      params: { id },
    });
    return response;
  },

  create: async (data: { name: string; description?: string; price: number; stock?: number }) => {
    const response = await apiClient.Product.createProduct({
      body: data,
    });
    return response;
  },

  update: async (
    id: string,
    data: Partial<{ name: string; description: string; price: number; stock: number }>,
  ) => {
    const response = await apiClient.Product.updateProduct({
      params: { id },
      body: data,
    });
    return response;
  },

  delete: async (id: string) => {
    const response = await apiClient.Product.deleteProduct({
      params: { id },
    });
    return response;
  },
};
```

### 5.2 Buat React Query hooks (opsional)

```typescript
// File: apps/frontend/src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/api/product";

export const useProducts = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.list(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof productApi.update>[1] }) =>
      productApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
```

---

## 📝 Checklist

Gunakan checklist ini untuk memastikan semua langkah sudah dilakukan:

- [ ] **Database**
  - [ ] Buat file migration baru
  - [ ] Tulis SQL CREATE TABLE dengan indexes
  - [ ] Tambahkan trigger updated_at
  - [ ] Jalankan migration

- [ ] **packages/zod**
  - [ ] Buat file schema baru
  - [ ] Definisikan Zod schemas (base, request, response, query)
  - [ ] Export dari index.ts
  - [ ] Build package

- [ ] **packages/openapi**
  - [ ] Buat file contract baru
  - [ ] Definisikan semua endpoints (CRUD)
  - [ ] Register di contracts/index.ts
  - [ ] Generate OpenAPI spec

- [ ] **Backend**
  - [ ] Model (struct + request types)
  - [ ] Repository (database operations)
  - [ ] Service (business logic)
  - [ ] Handler (HTTP handlers)
  - [ ] Router (route registration)
  - [ ] Update dependency injection files

- [ ] **Frontend**
  - [ ] API client functions
  - [ ] React Query hooks (opsional)

---

## 🔧 Tips & Best Practices

1. **Naming Convention**
   - File: lowercase dengan underscore (product.go, product.ts)
   - Struct/Type: PascalCase (Product, CreateProductRequest)
   - Database: snake_case (created_at, is_active)

2. **Validation**
   - Gunakan Zod di frontend dan packages
   - Gunakan go-playground/validator di backend
   - Validasi di kedua sisi (client & server)

3. **Error Handling**
   - Gunakan custom error types dari `internal/errs`
   - Return error yang meaningful ke client
   - Log error dengan context yang cukup

4. **Testing**
   - Tulis unit test untuk service layer
   - Tulis integration test untuk repository
   - Gunakan testcontainers untuk database testing

5. **Documentation**
   - OpenAPI spec otomatis ter-generate
   - Akses docs di `/docs` endpoint
   - Update PRD jika ada fitur baru yang signifikan
