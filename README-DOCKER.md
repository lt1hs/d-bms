# Docker Setup Instructions

This project has been configured to run with Docker. It uses:
- **Nginx** (Frontend Web Server & API Proxy)
- **PHP 8.2 FPM** (Laravel Backend)
- **MySQL 8.0** (Database)
- **Redis** (Cache/Session)

## Prerequisites
- Docker Desktop installed and running.

## How to Run

1.  **Build and Start Containers:**
    Open your terminal in this directory and run:
    ```bash
    docker-compose up -d --build
    ```

2.  **Setup Backend (First Time Only):**
    Initialize the Laravel application keys and database:
    ```bash
    # Install dependencies (if not fully installed by build) and setup keys
    docker-compose exec backend composer install
    docker-compose exec backend cp .env.example .env
    docker-compose exec backend php artisan key:generate
    docker-compose exec backend php artisan config:cache

    # Run Database Migrations
    docker-compose exec backend php artisan migrate --force

    # (Optional) Seed the database
    # docker-compose exec backend php artisan db:seed
    ```

3.  **Access the Application:**
    - Open [http://localhost](http://localhost) in your browser.

## Troubleshooting
- **Port Conflicts:** If port 80 is busy, edit `docker-compose.yml` frontend ports (e.g., `"8080:80"`) and access via `localhost:8080`.
- **Database Connection:** Ensure `docker-compose.yml` credentials match what you expect. The app uses `db` as the host.
