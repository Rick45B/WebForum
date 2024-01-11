class Projects{
    constructor(ID, Owner, Text, Likes, Dislikes, Useful, ProjectID, Date){
        this.ID = ID;
        this.Date = Date;
        this.Useful = Useful;
        this.ProjectID = ProjectID
        this.Owner = Owner;
        this.Text = Text;
        this.Likes = Likes;
        this.Dislikes = Dislikes;
    }

    /**
     * Construct a Comment object from a plain object
     * @param {*} json 
     * @return {Projects} the newly created Exam object
     */
    static from(json) {
        const e = Object.assign(new Projects(), json);
        return e;
    }
}

export default Projects;