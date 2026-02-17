import { createClient } from "@/lib/supabase/server";

export class SetupVersionService {
  /**
   * Create a new version of a setup (auto-versioning when setup is edited)
   */
  async createVersion(
    setupId: string,
    userId: string,
    setupData: any,
    changeNotes?: string,
    isManualSnapshot: boolean = false
  ) {
    const supabase = await createClient();

    // Get current setup to determine version number
    const { data: setup, error: setupError } = await supabase
      .from("suspension_setups")
      .select("version_count")
      .eq("id", setupId)
      .eq("user_id", userId)
      .single();

    if (setupError) throw setupError;

    const newVersionNumber = (setup?.version_count || 0) + 1;

    // Create version record
    const { data: version, error: versionError } = await supabase
      .from("setup_versions")
      .insert({
        setup_id: setupId,
        user_id: userId,
        version_number: newVersionNumber,
        is_manual_snapshot: isManualSnapshot,
        notes: changeNotes,
        // Snapshot all current settings
        fork_component_id: setupData.fork_component_id,
        fork_brand: setupData.fork_brand,
        fork_model: setupData.fork_model,
        fork_hsc: setupData.fork_hsc,
        fork_lsc: setupData.fork_lsc,
        fork_hsr: setupData.fork_hsr,
        fork_lsr: setupData.fork_lsr,
        fork_compression: setupData.fork_compression,
        fork_rebound: setupData.fork_rebound,
        fork_air_pressure: setupData.fork_air_pressure,
        fork_ramp_chamber_pressure: setupData.fork_ramp_chamber_pressure,
        fork_volume_spacers: setupData.fork_volume_spacers,
        fork_spring_rate: setupData.fork_spring_rate,
        fork_notes: setupData.fork_notes,
        shock_component_id: setupData.shock_component_id,
        shock_brand: setupData.shock_brand,
        shock_model: setupData.shock_model,
        shock_hsc: setupData.shock_hsc,
        shock_lsc: setupData.shock_lsc,
        shock_hsr: setupData.shock_hsr,
        shock_lsr: setupData.shock_lsr,
        shock_compression: setupData.shock_compression,
        shock_rebound: setupData.shock_rebound,
        shock_air_pressure: setupData.shock_air_pressure,
        shock_hbo: setupData.shock_hbo,
        shock_volume_spacers: setupData.shock_volume_spacers,
        shock_spring_rate: setupData.shock_spring_rate,
        shock_notes: setupData.shock_notes,
        general_notes: setupData.notes,
      })
      .select()
      .single();

    if (versionError) throw versionError;

    // Update setup to point to new version and increment version count
    const { error: updateError } = await supabase
      .from("suspension_setups")
      .update({
        current_version_id: version.id,
        version_count: newVersionNumber,
      })
      .eq("id", setupId)
      .eq("user_id", userId);

    if (updateError) throw updateError;

    console.log(`Created version ${newVersionNumber} of setup ${setupId}`);
    return version;
  }

  /**
   * Create a manual snapshot of current setup (user-initiated)
   */
  async createManualSnapshot(
    setupId: string,
    userId: string,
    snapshotName?: string,
    changeNotes?: string
  ) {
    const supabase = await createClient();

    // Get current setup data
    const { data: setup, error: setupError } = await supabase
      .from("suspension_setups")
      .select("*")
      .eq("id", setupId)
      .eq("user_id", userId)
      .single();

    if (setupError) throw setupError;

    // Create manual snapshot version
    const version = await this.createVersion(
      setupId,
      userId,
      setup,
      changeNotes ||
        `Manual snapshot: ${snapshotName || new Date().toLocaleDateString()}`,
      true
    );

    // Update version with name if provided
    if (snapshotName) {
      await supabase
        .from("setup_versions")
        .update({ version_name: snapshotName })
        .eq("id", version.id);
    }

    return version;
  }

  /**
   * Get all versions of a setup
   */
  async getSetupVersions(setupId: string, userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("setup_versions")
      .select("*")
      .eq("setup_id", setupId)
      .eq("user_id", userId)
      .order("version_number", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a specific version
   */
  async getVersion(versionId: string, userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("setup_versions")
      .select("*")
      .eq("id", versionId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Restore a previous version (creates new version with restored settings)
   */
  async restoreVersion(
    setupId: string,
    userId: string,
    versionIdToRestore: string
  ) {
    const supabase = await createClient();

    // Get the version to restore
    const oldVersion = await this.getVersion(versionIdToRestore, userId);
    if (!oldVersion) throw new Error("Version not found");

    // Get current setup
    const { data: setup, error: setupError } = await supabase
      .from("suspension_setups")
      .select("*")
      .eq("id", setupId)
      .eq("user_id", userId)
      .single();

    if (setupError) throw setupError;

    // Create new version with restored settings
    const restoredVersion = await this.createVersion(
      setupId,
      userId,
      {
        fork_component_id: oldVersion.fork_component_id,
        fork_brand: oldVersion.fork_brand,
        fork_model: oldVersion.fork_model,
        fork_hsc: oldVersion.fork_hsc,
        fork_lsc: oldVersion.fork_lsc,
        fork_hsr: oldVersion.fork_hsr,
        fork_lsr: oldVersion.fork_lsr,
        fork_compression: oldVersion.fork_compression,
        fork_rebound: oldVersion.fork_rebound,
        fork_air_pressure: oldVersion.fork_air_pressure,
        fork_ramp_chamber_pressure: oldVersion.fork_ramp_chamber_pressure,
        fork_volume_spacers: oldVersion.fork_volume_spacers,
        fork_spring_rate: oldVersion.fork_spring_rate,
        fork_notes: oldVersion.fork_notes,
        shock_component_id: oldVersion.shock_component_id,
        shock_brand: oldVersion.shock_brand,
        shock_model: oldVersion.shock_model,
        shock_hsc: oldVersion.shock_hsc,
        shock_lsc: oldVersion.shock_lsc,
        shock_hsr: oldVersion.shock_hsr,
        shock_lsr: oldVersion.shock_lsr,
        shock_compression: oldVersion.shock_compression,
        shock_rebound: oldVersion.shock_rebound,
        shock_air_pressure: oldVersion.shock_air_pressure,
        shock_hbo: oldVersion.shock_hbo,
        shock_volume_spacers: oldVersion.shock_volume_spacers,
        shock_spring_rate: oldVersion.shock_spring_rate,
        shock_notes: oldVersion.shock_notes,
        notes: oldVersion.general_notes,
      },
      `Restored from version ${oldVersion.version_number}`,
      false
    );

    // Update the setup with restored values
    const { error: updateError } = await supabase
      .from("suspension_setups")
      .update({
        fork_component_id: oldVersion.fork_component_id,
        fork_hsc: oldVersion.fork_hsc,
        fork_lsc: oldVersion.fork_lsc,
        fork_hsr: oldVersion.fork_hsr,
        fork_lsr: oldVersion.fork_lsr,
        fork_compression: oldVersion.fork_compression,
        fork_rebound: oldVersion.fork_rebound,
        fork_air_pressure: oldVersion.fork_air_pressure,
        fork_ramp_chamber_pressure: oldVersion.fork_ramp_chamber_pressure,
        fork_volume_spacers: oldVersion.fork_volume_spacers,
        fork_spring_rate: oldVersion.fork_spring_rate,
        fork_notes: oldVersion.fork_notes,
        shock_component_id: oldVersion.shock_component_id,
        shock_hsc: oldVersion.shock_hsc,
        shock_lsc: oldVersion.shock_lsc,
        shock_hsr: oldVersion.shock_hsr,
        shock_lsr: oldVersion.shock_lsr,
        shock_compression: oldVersion.shock_compression,
        shock_rebound: oldVersion.shock_rebound,
        shock_air_pressure: oldVersion.shock_air_pressure,
        shock_hbo: oldVersion.shock_hbo,
        shock_volume_spacers: oldVersion.shock_volume_spacers,
        shock_spring_rate: oldVersion.shock_spring_rate,
        shock_notes: oldVersion.shock_notes,
        notes: oldVersion.general_notes,
      })
      .eq("id", setupId)
      .eq("user_id", userId);

    if (updateError) throw updateError;

    console.log(
      ` Restored setup ${setupId} to version ${oldVersion.version_number}`
    );
    return restoredVersion;
  }

  /**
   * Get rides using a specific setup version
   */
  async getRidesForVersion(versionId: string, userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("strava_rides")
      .select(
        `*,
        bikes(brand, model, year),
        setup_versions(setup_id)`
      )
      .eq("setup_version_id", versionId)
      .eq("user_id", userId)
      .order("activity_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const setupVersionService = new SetupVersionService();
