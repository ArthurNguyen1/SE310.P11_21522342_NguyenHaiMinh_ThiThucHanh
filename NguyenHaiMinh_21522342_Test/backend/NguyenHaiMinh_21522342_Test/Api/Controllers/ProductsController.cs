using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NguyenHaiMinh_21522342_Test.Core.DTOs;
using NguyenHaiMinh_21522342_Test.Core.Entities;
using NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;
using NguyenHaiMinh_21522342_Test.Core.Interface.Services;

namespace NguyenHaiMinh_21522342_Test.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IRepository<Product> _productRepository;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IMapper _mapper;

    public ProductsController(IRepository<Product> productRepository, ICloudinaryService cloudinaryService, IMapper mapper)
    {
        _productRepository = productRepository;
        _cloudinaryService = cloudinaryService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _productRepository.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product != null ? Ok(product) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductCreateDto productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        var createdProduct = await _productRepository.AddAsync(product);
        return CreatedAtAction(nameof(GetById), new { id = createdProduct.ProductId }, createdProduct);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductCreateDto productDto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return NotFound();

        _mapper.Map(productDto, product);
        await _productRepository.UpdateAsync(product);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _productRepository.DeleteAsync(id);
        return NoContent();
    }

    //Product Image - related Cloudinary
    [HttpPost("{id}/upload-image")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return NotFound();

        var uploadResult = await _cloudinaryService.UploadImageAsync(file);
        if (uploadResult == null) return BadRequest("Image upload failed");

        product.ProductImage = uploadResult.SecureUrl.AbsoluteUri;
        await _productRepository.UpdateAsync(product);

        return Ok(new { ImageUrl = product.ProductImage });
    }

    [HttpDelete("{id}/delete-image")]
    public async Task<IActionResult> DeleteImage(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return NotFound();

        var publicId = product.ProductImage.Split('/').Last().Split('.').First();
        var deleteResult = await _cloudinaryService.DeleteImageAsync(publicId);
        if (deleteResult.Result != "ok") return BadRequest("Image deletion failed");

        product.ProductImage = null;
        await _productRepository.UpdateAsync(product);

        return NoContent();
    }
}
