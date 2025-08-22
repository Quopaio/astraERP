using Microsoft.EntityFrameworkCore;
using MixERP.Infrastructure.Data;
using MixERP.Infrastructure.Customers;


var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));


// Repos/services
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

builder.Services.AddControllers();
var app = builder.Build();

app.MapControllers();
app.Run();
