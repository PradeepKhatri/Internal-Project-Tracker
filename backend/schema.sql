-- First, create the Users table since Projects will reference it
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Password NVARCHAR(MAX) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'viewer',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    -- Enforce the roles allowed, similar to mongoose enum
    CONSTRAINT CHK_User_Role CHECK (Role IN ('viewer', 'admin', 'superadmin'))
);
GO

-- Create the Projects table
CREATE TABLE Projects (
    ProjectId INT IDENTITY(1,1) PRIMARY KEY,
    ProjectName NVARCHAR(255) NOT NULL UNIQUE,
    Department NVARCHAR(255) NOT NULL,
    CurrentStage NVARCHAR(50) NOT NULL DEFAULT 'Ideation',
    ProjectPartner NVARCHAR(255),

    -- Flattened 'milestone' object
    MilestoneStartPlanned DATETIME2 NOT NULL,
    MilestoneStartActual DATETIME2 NULL,
    MilestoneBrdSignOffPlanned DATETIME2 NOT NULL,
    MilestoneBrdSignOffActual DATETIME2 NULL,
    MilestoneDesignApprovalPlanned DATETIME2 NOT NULL,
    MilestoneDesignApprovalActual DATETIME2 NULL,
    MilestoneUatSignOffPlanned DATETIME2 NOT NULL,
    MilestoneUatSignOffActual DATETIME2 NULL,
    MilestoneDeploymentPlanned DATETIME2 NOT NULL,
    MilestoneDeploymentActual DATETIME2 NULL,
    
    -- Foreign Key relationship to the Users table
    ProjectManagerId INT NOT NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    -- Enforce the stages allowed
    CONSTRAINT CHK_Project_CurrentStage CHECK (CurrentStage IN ('Ideation', 'Requirement', 'Development', 'Testing', 'UAT', 'Go live')),
    
    -- Define the foreign key constraint
    CONSTRAINT FK_Projects_ProjectManager FOREIGN KEY (ProjectManagerId) REFERENCES Users(UserId)
);
GO

-- Finally, create the table for the files, linking back to Projects
CREATE TABLE ProjectFiles (
    FileId INT IDENTITY(1,1) PRIMARY KEY,
    Filename NVARCHAR(255) NOT NULL,
    ContentType NVARCHAR(100) NOT NULL,
    FileData VARBINARY(MAX) NOT NULL,

    -- Foreign Key relationship to the Projects table
    ProjectId INT NOT NULL,

    CONSTRAINT FK_ProjectFiles_Project FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE -- Optional: deletes files if project is deleted
);
GO