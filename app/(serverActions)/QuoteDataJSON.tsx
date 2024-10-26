"use server";
import fs from "fs/promises";
import path from "path";

// Helper function to read data from the specific JSON file
async function readData(id: string) {
  const filePath = getFilePath(id); // Use the previously defined getFilePath function
  try {
    const rawData = await fs.readFile(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    // Handle the error, such as if the file does not exist
    throw error;
  }
}

// Helper function to generate the file path for the given id
function getFilePath(id: string) {
  return path.join(process.cwd(), "data", `${id}.json`);
}

// Updated writeData function to write to a specific file based on the id
async function writeData(data: any, id: string) {
  const filePath = getFilePath(id);
  await fs.writeFile(filePath, JSON.stringify(data));
}

let queue: WriteJob[] = []; // Our write queue
let isProcessing = false; // Flag to check if a job is currently being processed

type WriteJob = {
  id: string;
  data: any;
  resolve: () => void;
  reject: (reason?: any) => void;
};

async function processQueue() {
  if (queue.length === 0 || isProcessing) {
    return; // If there's no job or a job is currently being processed, we exit
  }

  const job = queue.shift(); // Get the next job from the queue

  if (!job) {
    return; // Exit if no job was retrieved (just a safety check)
  }

  isProcessing = true;

  try {
    await writeData(job.data, job.id); // Write data to the file
    job.resolve(); // If successful, resolve the promise
  } catch (error) {
    job.reject(error); // If there's an error, reject the promise
  } finally {
    isProcessing = false; // Mark the job as done
    processQueue(); // Check if there are more jobs in the queue
  }
}

function queueWrite(data: any, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    queue.push({ id, data, resolve, reject }); // Push a new job into the queue
    processQueue(); // Start processing the queue
  });
}

// Helper function to get all quote file paths
async function getAllQuoteFilePaths(): Promise<string[]> {
  const dirPath = path.join(process.cwd(), "data");
  const files = await fs.readdir(dirPath);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.join(dirPath, file));
}

// Function to delete the oldest files
async function deleteOldestFiles(maxFiles: number): Promise<void> {
  try {
    const filePaths = await getAllQuoteFilePaths();
    if (filePaths.length > maxFiles) {
      // Get file creation times
      const fileCreationTimes = await Promise.all(
        filePaths.map(async (filePath) => {
          const stats = await fs.stat(filePath);
          return { filePath, ctime: stats.ctime.getTime() }; // Convert ctime to a numeric timestamp
        })
      );

      // Sort by creation time, oldest first
      fileCreationTimes.sort((a, b) => a.ctime - b.ctime);

      // Delete the oldest files
      for (let i = 0; i < fileCreationTimes.length - maxFiles; i++) {
        await fs.unlink(fileCreationTimes[i].filePath);
      }
    }
  } catch (error) {
    console.error("Error deleting oldest files:", error);
    // Handle errors as needed
  }
}

export async function getAllTextFilePaths(): Promise<string[]> {
  const dirPath = path.join(process.cwd(), "pricelist");
  const files = await fs.readdir(dirPath);

  return files
    .filter((file) => file.endsWith(".txt"))
    .map((file) => path.join(dirPath, file));
}

export async function getLatestUpdatedTimestamp(): Promise<Date | null> {
  try {
    const filePaths = await getAllTextFilePaths();

    // Return null if there are no .txt files
    if (filePaths.length === 0) {
      return null;
    }

    // Get modification times of all .txt files
    const fileModTimes = await Promise.all(
      filePaths.map(async (filePath) => {
        const stats = await fs.stat(filePath);
        return stats.mtime; // Return the modification time
      })
    );

    // Find the latest modification time
    const latestModTime = fileModTimes.reduce((latest, current) =>
      current > latest ? current : latest
    );

    return latestModTime;
  } catch (error) {
    console.error("Error getting latest updated timestamp:", error);
    throw error; // Handle error as needed
  }
}

export { deleteOldestFiles, queueWrite, readData, writeData };
