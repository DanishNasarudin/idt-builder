"use server";
import fs from "fs/promises";
import path from "path";

// Helper function to read data from the JSON file
async function readData() {
  const filePath = path.join(process.cwd(), "data", "quotes.json");
  const rawData = await fs.readFile(filePath, "utf8");
  return JSON.parse(rawData);
}

// Helper function to write data to the JSON file
function writeData(data: any) {
  const filePath = path.join(process.cwd(), "data", "quotes.json");
  fs.writeFile(filePath, JSON.stringify(data));
}

let queue: WriteJob[] = []; // Our write queue
let isProcessing = false; // Flag to check if a job is currently being processed

type WriteJob = {
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
    await writeData(job.data); // Write data to the file
    job.resolve(); // If successful, resolve the promise
  } catch (error) {
    job.reject(error); // If there's an error, reject the promise
  } finally {
    isProcessing = false; // Mark the job as done
    processQueue(); // Check if there are more jobs in the queue
  }
}

function queueWrite(data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    queue.push({ data, resolve, reject }); // Push a new job into the queue
    processQueue(); // Start processing the queue
  });
}

export { readData, writeData, queueWrite };
