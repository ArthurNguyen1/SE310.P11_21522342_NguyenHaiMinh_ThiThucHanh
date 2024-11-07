namespace NguyenHaiMinh_21522342_Test.Core.DTOs;

public class ProductCreateDto
{
    public string ProductName { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ProductImage { get; set; } // Cloudinary image URL
    public int CategoryID { get; set; }
}
