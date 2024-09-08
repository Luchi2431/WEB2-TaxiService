class User {
    constructor({id,userName, email,firstName,lastName,birthDate,address,token,UserType,isVerified,ProfilePicture}) {
      this.Id=id;
      this.UserName= userName;
      this.Email= email;
      this.FirstName=firstName;
      this.LastName= lastName;
      this.BirthDate = birthDate;
      this.Address = address;
      this.Token = token;
      this.UserType = UserType;
      this.IsVerified = isVerified;
      this.ProfilePicture = this.ProfilePicture;
    }
  }
  
  
  
  export default User;