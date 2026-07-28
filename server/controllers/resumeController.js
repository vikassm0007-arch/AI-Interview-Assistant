import mongoose from 'mongoose';
import Resume from '../models/Resume.js';

const skillsDatabase = {
  frontend: ["HTML5", "CSS Grid", "React.js", "TailwindCSS", "TypeScript", "Web Accessibility", "Redux Toolkit", "Vite", "Jest & RTL"],
  backend: ["Node.js", "Express.js", "PostgreSQL", "Redis Caching", "RESTful APIs", "GraphQL", "Docker", "AWS S3/EC2", "MongoDB"],
  uiux: ["Figma Design", "Low/High-Fi Wireframes", "User Research", "Interactive Prototyping", "Usability Heuristics", "Typography", "Color Theory", "Information Architecture"],
  fullstack: ["React.js", "Node.js", "PostgreSQL", "REST APIs", "Git Version Control", "CSS Grid", "AWS Infrastructure", "Jest Integration"]
};

// In-memory fallback datastore for parsed resumes
const mockResumes = [];

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Analyze a resume
// @route   POST /api/resumes/analyze
export const analyzeResume = async (req, res) => {
  try {
    const { fileName, fileSize, role } = req.body;

    if (!fileName || !fileSize || !role) {
      return res.status(400).json({ message: 'Please provide fileName, fileSize, and target role' });
    }

    const skills = skillsDatabase[role] || skillsDatabase.frontend;
    const experience = "4.5 Years";
    const score = 84;

    let resume;
    if (isDBConnected()) {
      resume = await Resume.create({
        userId: req.user ? req.user.id : null,
        fileName,
        fileSize,
        parsedRole: role,
        skills,
        experience
      });
    } else {
      resume = {
        _id: 'mock-resume-' + Math.random().toString(36).substr(2, 9),
        userId: req.user ? req.user.id : null,
        fileName,
        fileSize,
        parsedRole: role,
        skills,
        experience,
        createdAt: new Date()
      };
      mockResumes.push(resume);
      console.log(`[Resume] MongoDB offline: cached resume analysis for ${fileName}`);
    }

    res.status(201).json({
      _id: resume._id,
      fileName: resume.fileName,
      parsedRole: resume.parsedRole,
      skills: resume.skills,
      experience: resume.experience,
      matchScore: score,
      message: 'Resume analyzed successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
