namespace MixERP.Api.Models;

public class CustomerDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string? Code { get; set; }
    public string? City { get; set; }
}
