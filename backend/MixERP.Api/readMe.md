Start the host and React as before:

# Terminal A - Astra host on port 5080
cd /path/to/AstraERP
ASPNETCORE_URLS=http://localhost:5080 dotnet run

# Terminal B - React dev server
cd ClientApp
npm install
npm run dev


Now your UI at http://localhost:5173 calls /api/... → Astra host (5080) → placeholder API (5050).


## Database Migration

 **Reverse-engineer** EF Core classes from an existing DB (“database-first”).
 
  Here’s the clean, repeatable way to do it in your current layout (NET 7, Infrastructure = EF, Api = startup).

---

# 0) Ensure packages (EF Core 7)

Install these **in Infrastructure** (provider shown for PostgreSQL; switch to SQL Server if needed):

```bash
# PostgreSQL
dotnet add backend/MixERP.Infrastructure/MixERP.Infrastructure.csproj package Microsoft.EntityFrameworkCore --version 7.0.20
dotnet add backend/MixERP.Infrastructure/MixERP.Infrastructure.csproj package Microsoft.EntityFrameworkCore.Design --version 7.0.20
dotnet add backend/MixERP.Infrastructure/MixERP.Infrastructure.csproj package Npgsql.EntityFrameworkCore.PostgreSQL --version 7.0.11



Make sure **Api** references Infrastructure (and Domain if you have one):

```bash
dotnet add backend/MixERP.Api/MixERP.Api.csproj reference backend/MixERP.Infrastructure/MixERP.Infrastructure.csproj
```

---

# 1) Put your connection string in Api

`backend/MixERP.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=mixerp;Username=postgres;Password=postgres"
    // SQL Server example:
    // "Default": "Server=localhost,1433;Database=mixerp;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True"
  }
}
```

In `backend/MixERP.Api/Program.cs` (already likely present):

```csharp
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));


> `AppDbContext` will be created by scaffolding in Step 2 (or you can scaffold entities only and keep your own context—both shown below).

---

# 2) Scaffold from the database (generate classes)

Run from **repo root**. We’ll generate entities into `Infrastructure/Models`, and the context into `Infrastructure/Data`.

### PostgreSQL

```bash
dotnet ef dbcontext scaffold \
  "Host=localhost;Port=5432;Database=mixerp;Username=postgres;Password=postgres" \
  Npgsql.EntityFrameworkCore.PostgreSQL \
  -p backend/MixERP.Infrastructure/MixERP.Infrastructure.csproj \
  -s backend/MixERP.Api/MixERP.Api.csproj \
  -o Models \
  --context-dir Data \
  --context AppDbContext \
  --use-database-names \
  --data-annotations \
  --no-onconfiguring \
  --force
```



### Useful tweaks

* **Limit to specific schema**: `--schema public` (PG) or `--schema dbo` (SQL)
* **Limit to tables**: `--table customers --table orders`
* **Exclude EF history table**: not needed for DB-first, but if present you can skip by not listing it
* **Regenerate (refresh)**: add `--force` (as shown) to overwrite

This produces:

```
backend/MixERP.Infrastructure/
├─ Data/
│  └─ AppDbContext.cs
└─ Models/
   ├─ Customers.cs
   ├─ Orders.cs
   └─ ...
```

---

# 3) Keep Infrastructure “pure EF”; map to Domain if you want

Two common patterns:

### A) Simple (fastest)

Use the **scaffolded entities directly** in your controllers/services for now. You can refactor later.

### B) Clean architecture

* Keep scaffolded types under `Infrastructure/Models/*`
* Keep your **Domain** entities separate (`Domain/*`)
* Add small mappers to convert between Infrastructure models ↔ Domain models (e.g., with Mapster/AutoMapper or hand-written mapping).

---

# 4) Use the new context in your API

Example controller using the scaffolded `AppDbContext` + `Models.Customer`:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MixERP.Infrastructure.Data;
using MixERP.Infrastructure.Models;

[ApiController]
[Route("customers")]
public class CustomersController : ControllerBase
{
    private readonly AppDbContext _db;
    public CustomersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get(int page = 1, int size = 25)
    {
        var q = _db.Customers.AsNoTracking().OrderBy(c => c.Name);
        var total = await q.CountAsync();
        var items = await q.Skip((page - 1) * size).Take(size).ToListAsync();
        return Ok(new { items, total });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Customer dto)
    {
        _db.Customers.Add(dto);
        await _db.SaveChangesAsync();
        return Ok(dto);
    }
}
```

> Replace `Customers`/`Name` with your actual scaffolded type & columns.

---

# 5) Migrations (optional, after DB-first)

* You **don’t have to** create migrations if the DB already exists and you’re not changing schema.
* If you want EF to manage future schema changes, start tracking with a baseline migration **after** scaffolding:

```bash
dotnet ef migrations add Baseline \
  -p backend/MixERP.Infrastructure/MixERP.Infrastructure.csproj \
  -s backend/MixERP.Api/MixERP.Api.csproj
```

After that, any model changes → `dotnet ef migrations add <Name>` → `dotnet ef database update`.

---

# 6) Security tips

* Don’t commit real passwords—use environment variables or `User Secrets` in dev.
* For CLI scaffolding, you can put the connection string in a temp env var:

  ```bash
  export MIXERP_CS="Host=...;Password=..."
  dotnet ef dbcontext scaffold "$MIXERP_CS" Npgsql.EntityFrameworkCore.PostgreSQL ...
  ```

---

## TL;DR commands (Postgres example)

```bash
# Install provider (EF Core 7)
dotnet add backend/MixERP.Infrastructure/MixERP.Infrastructure.csproj package Npgsql.EntityFrameworkCore.PostgreSQL --version 7.0.11
dotnet add backend/MixERP.Infrastructure/MixERP.Infrastructure.csproj package Microsoft.EntityFrameworkCore.Design --version 7.0.20

# Scaffold
dotnet ef dbcontext scaffold "Host=localhost;Port=5432;Database=mixerp;Username=postgres;Password=postgres" \
  Npgsql.EntityFrameworkCore.PostgreSQL \
  -p backend/MixERP.Infrastructure/MixERP.Infrastructure.csproj \
  -s backend/MixERP.Api/MixERP.Api.csproj \
  -o Models --context-dir Data --context AppDbContext \
  --use-database-names --data-annotations --no-onconfiguring --force
```

Run the **API** on `http://localhost:5050`, your **host** on `http://localhost:5080`, and your **Vite UI** on `http://localhost:5173` as before. If you paste one of your table names (and schema), I can give you a scaffold command narrowed to just those tables.

