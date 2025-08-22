using MixERP.Domain.Customers;
using MixERP.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MixERP.Infrastructure.Customers;
public interface ICustomerRepository
{
    Task<(IReadOnlyList<Customer> items,int total)> GetPagedAsync(int page,int size);
    Task<Customer> CreateAsync(Customer c);
}

public class CustomerRepository : ICustomerRepository
{
    private readonly AppDbContext _db;
    public CustomerRepository(AppDbContext db) => _db = db;

    public async Task<(IReadOnlyList<Customer>,int)> GetPagedAsync(int page,int size)
    {
        var query = _db.Customers.AsNoTracking().OrderBy(c => c.Name);
        var total = await query.CountAsync();
        var items = await query.Skip((page-1)*size).Take(size).ToListAsync();
        return (items,total);
    }

    public async Task<Customer> CreateAsync(Customer c)
    {
        _db.Customers.Add(c);
        await _db.SaveChangesAsync();
        return c;
    }
}
