# **Vanuatu Labour Registry**

The **Vanuatu Labour Registry** is a web application designed to manage labour movement data for the Vanuatu government. It offers a modern interface to view, search, and update registry records, built with robust web technologies for scalability and ease of use.

## **Table of Contents**
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## **Features**
- **Instant Search**: Filter registry records in real-time across displayed columns (`surname`, `given_name`, `dob`, `sex`, `travel_date`, `direction`, `travel_reason`, `destination_coming_from`).
- **Interactive Data Table**: View registry data with sortable columns and clickable rows to access detailed records.
- **Record Editing**: Update all 16 registry fields via an intuitive form, with an `Update` button appearing on changes.
- **Responsive Design**: Styled with **Tailwind CSS** for a mobile-friendly experience.
- **Secure Authentication**: **Laravel** authentication with middleware for protected routes.
- **Error Handling**: Comprehensive error pages and logging for database and validation issues.

## **Technologies**
- **Backend**: **Laravel** 11 (PHP 8.2+)
- **Frontend**: **React** 18, **TypeScript**, **Inertia.js**, **Tailwind CSS**
- **Data Table**: `@tanstack/react-table` v8
- **Build Tool**: **Vite** 6.2.0
- **Database**: **MySQL**
- **Environment**: **XAMPP** (Windows)

## **Prerequisites**
- **PHP**: 8.2 or higher
- **Composer**: Latest version
- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **MySQL**: 8.0 or higher
- **XAMPP**: Configured with Apache and MySQL
- **Git**: For cloning the repository

## **Installation**
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/vanuatu-labour-registry.git
   cd vanuatu-labour-registry
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your database credentials:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=vanuatu_labour_registry
     DB_USERNAME=root
     DB_PASSWORD=
     ```
   - Generate an application key:
     ```bash
     php artisan key:generate
     ```

5. **Run Migrations**
   ```bash
   php artisan migrate
   ```

6. **Seed Test Data (Optional)**
   ```bash
   php artisan tinker
   ```
   ```php
   use App\Models\Registry;
   Registry::create([
       'surname' => 'Doe',
       'given_name' => 'John',
       'nationality' => 'Vanuatu',
       'country_of_residence' => 'Vanuatu',
       'document_type' => 'Passport',
       'document_no' => '123456',
       'dob' => '1990-01-01',
       'age' => 35,
       'sex' => 'Male',
       'travel_date' => '2025-05-16',
       'direction' => 'Inbound',
       'accommodation_address' => '123 Main St',
       'note' => null,
       'travel_reason' => 'Work',
       'border_post' => 'Port Vila',
       'destination_coming_from' => 'Australia',
   ]);
   Registry::create([
       'surname' => 'Smith',
       'given_name' => 'Jane',
       'nationality' => 'Australia',
       'country_of_residence' => 'Australia',
       'document_type' => 'Passport',
       'document_no' => '789012',
       'dob' => '1985-06-15',
       'age' => 40,
       'sex' => 'Female',
       'travel_date' => '2025-05-17',
       'direction' => 'Outbound',
       'accommodation_address' => '456 Ocean Rd',
       'note' => 'Business trip',
       'travel_reason' => 'Business',
       'border_post' => 'Port Vila',
       'destination_coming_from' => 'New Zealand',
   ]);
   exit;
   ```

7. **Build Assets**
   ```bash
   npm run build
   ```

8. **Start Servers**
   - **Laravel**:
     ```bash
     php artisan serve
     ```
   - **Vite**:
     ```bash
     npm run dev
     ```

9. **Access the Application**
   - Open `http://localhost:8000` in your browser.
   - Register or log in to access the dashboard and registry.

## **Usage**
1. **View Registry Data**
   - Navigate to `/registry` via the sidebar ("View Data").
   - Use the search input to filter records instantly (e.g., type `Doe` or `2025-05`).
   - Sort columns by clicking headers (e.g., `Surname`).
   - Click a row to view/edit a record.

2. **Edit Records**
   - On `/registry/{id}`, view all 16 fields in input fields.
   - Edit any field; an `Update` button appears when changes are made.
   - Click `Update` to save changes (note: if updates fail, check logs).
   - Click `Back` to return to `/registry`.

3. **Troubleshooting**
   - **Unresponsive UI**: If the app freezes after updating, check browser console (F12) and `storage/logs/laravel.log`.
   - **Database Issues**: Verify migrations and `.env` settings.
   - **Build Errors**: Clear caches and rebuild:
     ```bash
     php artisan cache:clear
     php artisan config:clear
     php artisan route:clear
     rm -rf node_modules/.vite
     rm -rf public/build
     npm run build
     ```

## **Project Structure**
```
vanuatu-labour-registry/
├── app/
│   ├── Http/
│   │   └── Controllers/RegistryController.php
│   └── Models/Registry.php
├── resources/
│   ├── js/
│   │   ├── Components/AppSidebar.tsx
│   │   ├── layouts/app-layout.tsx
│   │   ├── pages/
│   │   │   ├── registry/
│   │   │   │   ├── index.tsx
│   │   │   │   └── show.tsx
│   │   │   └── Error.tsx
│   │   ├── types/index.ts
│   │   └── app.tsx
│   ├── css/app.css
│   └── views/app.blade.php
├── routes/web.php
├── database/
│   └── migrations/
├── .env.example
├── composer.json
├── package.json
├── vite.config.ts
└── README.md
```

- `RegistryController.php`: Handles CRUD operations for registry records.
- `index.tsx`: Displays searchable, sortable table with 8 columns.
- `show.tsx`: Form for viewing/editing all 16 columns.
- `AppSidebar.tsx`: Navigation with links to dashboard and registry.

## **Database Schema**
The `registry` table has 16 columns:

```sql
CREATE TABLE registry (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    surname VARCHAR(255) NOT NULL,
    given_name VARCHAR(255) NOT NULL,
    nationality VARCHAR(255) NOT NULL,
    country_of_residence VARCHAR(255) NOT NULL,
    document_type VARCHAR(255) NOT NULL,
    document_no VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    age INT NOT NULL,
    sex VARCHAR(50) NOT NULL,
    travel_date DATE NOT NULL,
    direction VARCHAR(255) NOT NULL,
    accommodation_address VARCHAR(255) NOT NULL,
    note TEXT NULL,
    travel_reason VARCHAR(255) NOT NULL,
    border_post VARCHAR(255) NOT NULL,
    destination_coming_from VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

**Note**: Actual registry data is not shared in this repository for privacy and security reasons. To populate the database with dummy data for testing, use the `tinker` commands provided in the [Installation](#installation) section under "Seed Test Data."

## **Contributing**
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

Please include tests and follow coding standards (**PSR-12** for PHP, **ESLint** for TypeScript).

## **License**
This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

## **Contact**
For support or inquiries, contact the **Vanuatu Labour Registry** team at:
- **Email**: support@vanuatu-labour-registry.gov.vu
- **GitHub Issues**: [Open an issue](https://github.com/your-username/vanuatu-labour-registry/issues)

---

*Developed for the **Vanuatu Labour Registry**, May 2025*
