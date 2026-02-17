"use server";

import { setupVersionService } from "@/lib/setup-version-service";

export async function createSetupVersionAction(
  setupId: string,
  userId: string,
  setupData: any
) {
  try {
    console.log("Server action: Creating version for setup", setupId);
    const version = await setupVersionService.createVersion(
      setupId,
      userId,
      setupData
    );
    return { success: true, version };
  } catch (error) {
    console.error("Error creating version:", error);
    throw error;
  }
}
