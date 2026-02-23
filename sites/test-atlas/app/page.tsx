/**
 * Home Page
 *
 * Generated from site analysis blueprint.
 * Path: /
 */

import { DirectoryListing } from "@platform/themes/atlas/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Displays a server-generated directory index listing folders with name, last modified date, and size columns — from custom-directory-listing */}
      <DirectoryListing />

    </div>
  );
}
