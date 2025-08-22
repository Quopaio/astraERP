namespace MixERP.Domain.Customers;
public sealed class Customer
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; private set; } = "";
    public string? Code { get; private set; }
    public string? City { get; private set; }

    public Customer(string name, string? code=null, string? city=null)
    {
        Name = name; Code = code; City = city;
    }
}
