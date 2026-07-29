import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import pdf from 'pdf-parse';
import path from 'path';

const prisma = new PrismaClient();

// Mock S3/Storage upload helper returning static/local storage URL
const uploadToStorage = async (file: Express.Multer.File): Promise<string> => {
  // In a production setup, this integrates with AWS S3, Supabase, etc.
  // For the prototype, we return a mock file path relative to storage root.
  return `/storage/resumes/${Date.now()}_${path.basename(file.originalname)}`;
};

// Mock parsing heuristics matching parsed roles to key technologies
const extractMockSkills = (text: string, role: string): string[] => {
  const normalized = text.toLowerCase();
  const skillsList: Record<string, string[]> = {
    frontend: ["React", "TypeScript", "TailwindCSS", "Vite", "Redux", "Jest"],
    backend: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "Docker"],
    fullstack: ["React", "Node.js", "Express", "PostgreSQL", "TypeScript", "AWS"],
    uiux: ["Figma", "Wireframes", "Typography", "Prototyping", "User Research"]
  };

  const candidateSkills = skillsList[role] || skillsList.frontend;
  return candidateSkills.filter(skill => normalized.includes(skill.toLowerCase()));
};

// @desc    Upload and parse PDF Resume
// @route   POST /api/resumes/upload
export const uploadResume = async (req: Request, res: Response) => {
  try {
    // Access authentication context injected by JWT middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User session not found" });
    }

    const file = req.file;
    const { targetRole } = req.body;

    if (!file) {
      return res.status(400).json({ message: "Please upload a resume file" });
    }

    if (!targetRole) {
      return res.status(400).json({ message: "Please specify target role" });
    }

    // 1. File Format Integrity Validations
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: "Invalid file format: Only PDF documents are allowed" });
    }

    // Double check size bounds
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      return res.status(400).json({ message: "File is too large: Maximum limit is 5 MB" });
    }

    // 2. Extract Raw Text using pdf-parse
    let pdfData;
    try {
      pdfData = await pdf(file.buffer);
    } catch (parseErr) {
      console.error(`PDF Text Extraction Failed: ${parseErr}`);
      return res.status(422).json({ message: "Failed to parse document: PDF might be corrupted" });
    }

    const rawText = pdfData.text;
    if (!rawText || rawText.trim().length === 0) {
      return res.status(422).json({ message: "Unreadable document: No text content found in PDF" });
    }

    // 3. Upload File to Storage
    const fileUrl = await uploadToStorage(file);

    // 4. Run matching heuristics & extract technology arrays
    const skills = extractMockSkills(rawText, targetRole);
    const experience = rawText.match(/\b\d+\+?\s*(?:years?|yrs?)\b/i)?.[0] || "Entry Level";
    const matchScore = Math.floor(Math.random() * 20) + 75; // Mock score 75-95%

    // 5. Store Resume record in Database via Prisma
    const resume = await prisma.resume.create({
      data: {
        userId,
        fileName: file.originalname,
        fileSize: file.size,
        fileUrl,
        extractedText: rawText,
        parsedRole: targetRole,
        skills,
        experience,
        matchScore
      }
    });

    res.status(201).json({
      message: "Resume uploaded and parsed successfully",
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        parsedRole: resume.parsedRole,
        skills: resume.skills,
        experience: resume.experience,
        matchScore: resume.matchScore,
        createdAt: resume.createdAt
      }
    });
  } catch (error: any) {
    console.error(`Resume Upload Error: ${error.message}`);
    res.status(500).json({ message: "An error occurred during resume uploading" });
  }
};

// @desc    Get user uploaded resumes list
// @route   GET /api/resumes
export const getUserResumes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        parsedRole: true,
        skills: true,
        experience: true,
        matchScore: true,
        createdAt: true
      }
    });

    res.json(resumes);
  } catch (error: any) {
    console.error(`Fetch Resumes Error: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch resume history" });
  }
};
