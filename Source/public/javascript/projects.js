class Projects{
    constructor(ID, Name, Date, Owner, Img, Files, Description, Likes, Dislikes, latestComment){
        this.ID = ID;
        this.Name = Name;
        this.Date = Date;
        this.Owner = Owner;
        this.Img = Img;
        this.Files = Files;
        this.Description = Description;
        this.Likes = Likes;
        this.Dislikes = Dislikes;
        this.latestComment = latestComment;
    }

    /**
     * Construct a Project object from a plain object
     * @param {*} json 
     * @return {Projects} the newly created Exam object
     */
    static from(json) {
        const e = Object.assign(new Projects(), json);
        return e;
    }
}

export default Projects;