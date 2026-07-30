import { parseResumeBuffer } from '../services/resumeParser.js';
import { generateQuestionsList } from '../services/questionGenerator.js';

// @desc    Parse PDF resume and extract structured details
// @route   POST /api/parse-resume
export const parseResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Please upload a PDF resume file" });
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: "Invalid file format: Only PDF documents are allowed" });
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      return res.status(400).json({ message: "File is too large: Maximum limit is 5 MB" });
    }

    console.log(`[AI Controller] Received PDF file: ${file.originalname} (${file.size} bytes)`);
    
    // Extract raw text and structure it via AI or mock fallbacks
    const parsedData = await parseResumeBuffer(file.buffer, file.originalname);

    res.status(200).json({
      message: "Resume parsed successfully",
      parsedResume: parsedData
    });
  } catch (error) {
    console.error(`[AI Controller] Resume Parsing Error: ${error.message}`);
    res.status(500).json({ message: "An error occurred during resume text extraction" });
  }
};

// @desc    Generate interview questions based on parsed resume
// @route   POST /api/generate-questions
export const generateQuestions = async (req, res) => {
  try {
    const { extractedResumeData, targetRole, experienceLevel } = req.body;

    if (!extractedResumeData) {
      return res.status(400).json({ message: "Parsed resume data is required" });
    }
    if (!targetRole) {
      return res.status(400).json({ message: "Target role is required" });
    }
    if (!experienceLevel) {
      return res.status(400).json({ message: "Experience level is required" });
    }

    console.log(`[AI Controller] Generating questions for role: ${targetRole} (${experienceLevel} level)`);

    const questions = await generateQuestionsList(extractedResumeData, targetRole, experienceLevel);

    res.status(200).json({
      message: "Questions generated successfully",
      questions
    });
  } catch (error) {
    console.error(`[AI Controller] Questions Generation Error: ${error.message}`);
    res.status(500).json({ message: "An error occurred while generating interview questions" });
  }
};
