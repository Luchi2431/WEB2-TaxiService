using Common;
using DataAccessLayer.DTO;
using DataAccessLayer.IRepository;
using Notification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Verification
{
    public class VerificationService : IVerificationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;

        public VerificationService(IUserRepository userRepository, IEmailService emailService)
        {
            _userRepository = userRepository;
            _emailService = emailService;
        }

        public async Task<bool> ApproveDriverAsync(int driverId)
        {
            // Pronađi vozača po ID-ju
            var driver = await _userRepository.GetUserByIdAsync(driverId);

            if (driver == null || driver.UserTypes != UserType.Driver || driver.IsVerified != VerifiedStatus.InProgress)
            {
                return false; // Vozač nije pronađen ili nije vozač ili status nije "InProgress"
            }

            // Ažuriraj status verifikacije vozača
            driver.IsVerified = VerifiedStatus.Verified; // Verifikovan



            ProfileDTO updatedDriver = _userRepository.UpdateUserAsync(driver);



            string emailContent;
            emailContent = $"Zdravo {updatedDriver.FirstName} {updatedDriver.LastName},";
            emailContent += $"Vas nalog je prihvacen.";

            var success = await _emailService.SendMailAsync(new EmailData()
            {
                Towho = updatedDriver.Email,
                Content = emailContent,
                HtmlContent = true,
                Subject = "Verifikacija naloga"
            });


            // Sačuvaj promene u bazi podataka

            return true;
        }

        // Funkcija za odbijanje vozača
        public async Task<bool> RejectDriverAsync(int driverId)
        {
            // Pronađi vozača po ID-ju
            var driver = await _userRepository.GetUserByIdAsync(driverId);

            if (driver == null || driver.UserTypes != UserType.Driver || driver.IsVerified != VerifiedStatus.InProgress)
            {
                return false; // Vozač nije pronađen ili nije vozač ili status nije "InProgress"
            }


            // Ažuriraj status verifikacije vozača
            driver.IsVerified = VerifiedStatus.Denied; // Odbijen

            // Sačuvaj promene u bazi podataka
            ProfileDTO updatedDriver = _userRepository.UpdateUserAsync(driver);


            string emailContent;
            emailContent = $"Zdravo {updatedDriver.FirstName} {updatedDriver.LastName},";
            emailContent += $"Vas nalog je blokiran.";

            var success = await _emailService.SendMailAsync(new EmailData()
            {
                Towho = updatedDriver.Email,
                Content = emailContent,
                HtmlContent = true,
                Subject = "Verifikacija naloga"
            });


            return true;
        }
    }

}
