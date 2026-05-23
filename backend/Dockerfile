FROM php:8.3-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    libcurl4-openssl-dev \
    libssl-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring xml bcmath zip pcntl sockets \
    && pecl install swoole redis \
    && docker-php-ext-enable swoole redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock* ./

# Install dependencies
RUN composer install --no-scripts --no-autoloader --prefer-dist 2>/dev/null || true

# Copy application code
COPY . .

# Final composer setup
RUN composer install --prefer-dist --optimize-autoloader 2>/dev/null || true

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

EXPOSE 8000

# Start with Octane (Swoole)
CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8000"]
