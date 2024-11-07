using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using NguyenHaiMinh_21522342_Test.Core.DTOs;
using NguyenHaiMinh_21522342_Test.Core.Entities;
using NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;

namespace NguyenHaiMinh_21522342_Test.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CategoriesController(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _categoryRepository.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category != null ? Ok(category) : NotFound();
    }

    [HttpGet("{id}/products")]
    public async Task<IActionResult> GetCategoryWithProducts(int id)
    {
        var category = await _categoryRepository.GetCategoryWithProductsAsync(id);
        return category != null ? Ok(category) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryCreateDto categoryDto)
    {
        var category = _mapper.Map<Category>(categoryDto);
        var createdCategory = await _categoryRepository.AddAsync(category);
        return CreatedAtAction(nameof(GetById), new { id = createdCategory.CategoryId }, createdCategory);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryCreateDto categoryDto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null) return NotFound();

        _mapper.Map(categoryDto, category);
        await _categoryRepository.UpdateAsync(category);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _categoryRepository.DeleteAsync(id);
        return NoContent();
    }
}
