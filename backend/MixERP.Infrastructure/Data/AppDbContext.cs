using Microsoft.EntityFrameworkCore;
using MixERP.Domain.Customers;

namespace MixERP.Infrastructure.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    public DbSet<Customer> Customers => Set<Customer>();
}
