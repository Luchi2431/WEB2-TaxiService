using DataAccessLayer.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserService.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/user")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile(int id)
        {
            try
            {
                ProfileDTO response = await _userService.GetUserProfileAsync(id);
                return Ok(response);

            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] ProfileDTO profileDTO, IFormFile? profilePicture = null)
        {
            try
            {
                ProfileDTO response = await _userService.UpdateUserProfileAsync(profileDTO, profilePicture);
                return Ok(response);

            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("get-drivers")]
        public async Task<IActionResult> GetDrivers()
        {
            try
            {
                var drivers = await _userService.GetDriversAsync();
                return Ok(drivers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }





    }

}
