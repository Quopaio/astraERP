using Microsoft.EntityFrameworkCore;
using MixERP.Api.Models;
using MixERP.Api.Services;
using MixERP.Domain.Customers;
using MixERP.Infrastructure.Data;

namespace MixERP.Api.Services;

// NOTE: This implementation uses AppDbContext directly (no ICustomerRepository).
public class EfCustomersStore : ICustomersStore
{
    private readonly AppDbContext _db;
    public EfCustomersStore(AppDbContext db) => _db = db;

    public (IReadOnlyList<CustomerDto> items, int total) GetPaged(int page, int size, string? q = null)
    {
        if (page <= 0) page = 1;
        if (size <= 0) size = 20;

        IQueryable<Customer> query = _db.Set<Customer>().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var s = q.Trim().ToLowerInvariant();
            query = query.Where(c =>
                c.Name.ToLower().Contains(s) ||
                (c.Code ?? string.Empty).ToLower().Contains(s) ||
                (c.City ?? string.Empty).ToLower().Contains(s));
        }

        var total = query.Count();

        var items = query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * size)
            .Take(size)
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                Name = c.Name,
                Code = c.Code,
                City = c.City
            })
            .ToList();

        return (items, total);
    }

    public CustomerDto? GetById(Guid id)
    {
        var c = _db.Set<Customer>().AsNoTracking().FirstOrDefault(x => x.Id == id);
        return c is null ? null : new CustomerDto { Id = c.Id, Name = c.Name, Code = c.Code, City = c.City };
    }

    public CustomerDto Create(CustomerDto dto)
    {
        var entity = new Customer(dto.Name, dto.Code, dto.City)
        {
            // preserve provided Id if present
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid()
        };

        _db.Add(entity);
        _db.SaveChanges();

        return new CustomerDto { Id = entity.Id, Name = entity.Name, Code = entity.Code, City = entity.City };
    }

    public CustomerDto? Update(Guid id, CustomerDto update)
    {
        var existing = _db.Set<Customer>().FirstOrDefault(x => x.Id == id);
        if (existing is null) return null;

        // Customer has private setters; re-create with same Id (or call domain methods if available)
        var updated = new Customer(update.Name ?? existing.Name, update.Code ?? existing.Code, update.City ?? existing.City)
        {
            Id = id
        };

        _db.Entry(existing).State = EntityState.Detached; // avoid tracking conflict
        _db.Update(updated);
        _db.SaveChanges();

        return new CustomerDto { Id = updated.Id, Name = updated.Name, Code = updated.Code, City = updated.City };
    }

    public bool Delete(Guid id)
    {
        var entity = _db.Set<Customer>().FirstOrDefault(x => x.Id == id);
        if (entity is null) return false;
        _db.Remove(entity);
        _db.SaveChanges();
        return true;
    }
}
