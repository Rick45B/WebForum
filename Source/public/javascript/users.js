class Users{
    constructor(Nick, Passwd, Mail, RepeatMail, Bio, Image, Role, frontBio){
        this.Nick = Nick;
        this.Passwd = Passwd;
        this.Mail = Mail;
        this.RepeatMail = RepeatMail;
        this.Bio = Bio;
        this.frontBio = frontBio
        this.Image = Image;
        this.Role = Role;
    }

    /**
     * Construct a Project object from a plain object
     * @param {*} json 
     * @return {Projects} the newly created Exam object
     */
    static from(json) {
        const e = Object.assign(new Users(), json);
        return e;
    }
}

export default Users;