CREATE TABLE "comments" (
	"Owner"	TEXT NOT NULL,
	"Text"	TEXT NOT NULL,
	"Likes"	INTEGER NOT NULL DEFAULT 0 CHECK("Likes" >= 0),
	"Dislikes"	INTEGER NOT NULL DEFAULT 0 CHECK("Dislikes" >= 0),
	"Useful"	INTEGER NOT NULL DEFAULT 0 CHECK("Useful" >= 0),
	"ProjectName"	TEXT NOT NULL,
	"ProjectOwn"	TEXT NOT NULL,
	FOREIGN KEY("ProjectName","ProjectOwn") REFERENCES "Projects"("Name","Owner") ON UPDATE CASCADE ON DELETE CASCADE
);