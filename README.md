# Product Catalog API

A robust, full-stack e-commerce product catalog application built with Spring Boot (Backend) and React + Vite (Frontend). 

The API was designed to solve two major problems common in e-commerce backends: performance (handling large datasets without choking the client) and security (preventing the leak of internal business data).

## Features and Architecture

### Backend (The Core)
- DTO Pattern: The API strictly returns only 6 safe fields (id, name, description, category, price, stockQuantity). Internal fields like costPrice and supplierId are never exposed to the client.
- Pagination: Implemented using Pageable and PageRequest. The API defaults to 10 items per page, caps at a strict maximum of 50, and uses SQL LIMIT/OFFSET to prevent the server from loading all 50,000+ rows into memory.
- Smart Filtering: Supports dynamic filtering via query parameters (?category=..., ?maxPrice=...).
- Secure Sorting: Supports sorting (?sort=price,desc) but uses a strict whitelist (only id, price, name, stockQuantity are allowed). Unknown fields trigger a custom InvalidSortFieldException.
- Custom Page Wrapper: Replaced Spring's default Page serialization with a clean PageResponse DTO (content, pageNumber, pageSize, totalElements, totalPages, last).
- Robust Error Handling: A RestControllerAdvice (GlobalExceptionHandler) catches errors and returns clean, standardized JSON responses for 400, 404, and 409 status codes.
- Data Seeding: A CommandLineRunner automatically seeds 1,000 dummy products across 5 categories on startup for testing.

### Frontend (React + Vite)
- Interactive Data Table: Renders paginated data fetched via Axios.
- Dynamic Controls: Includes category filters, max-price inputs, sort dropdowns, and a page-size selector.
- CRUD Operations: Includes modal forms for creating and editing products, as well as a delete feature.
- State Management: Pagination and filtering are driven by useEffect watching the query parameters.

## Tech Stack

Backend:
- Java 17
- Spring Boot 3 (Web, Data JPA)
- Hibernate / MySQL
- Maven
- Bean Validation

Frontend:
- React
- Vite
- Axios
- Custom CSS

## Project Structure

```text
Product-Catalog/
├── src/main/java/com/inika/product_catalog/Backend/
│   ├── Product.java
│   ├── ProductDTO.java
│   ├── ProductMapper.java
│   ├── ProductController.java
│   ├── ProductService.java
│   ├── ProductRepository.java
│   ├── PageResponse.java
│   ├── GlobalExceptionHandler.java
│   ├── DataSeeder.java
│   └── CorsConfig.java
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── pom.xml
└── mvnw / mvnw.cmd
```

## Getting Started

### Prerequisites
- Java 17+
- Maven
- Node.js & npm
- MySQL (Ensure you have a database created and configured in application.properties)

### 1. Run the Backend
From the project root, run:
```bash
./mvnw spring-boot:run
```
The backend will start on http://localhost:8080. The DataSeeder will automatically populate your database with 1,000 products.

### 2. Run the Frontend
Open a second terminal, navigate to the frontend folder, and run:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on http://localhost:5173.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Fetch a paginated, filtered, and sorted list of products |
| GET | /api/products/{id} | Fetch a single product by ID |
| POST | /api/products | Create a new product |
| PUT | /api/products/{id} | Update an existing product |
| DELETE | /api/products/{id} | Delete a product |

### Example Query
```http
GET /api/products?category=Electronics&maxPrice=500&sort=price,desc&page=0&size=10
```

## Author

Inika Kumar
- GitHub: https://github.com/inikakumar
```
