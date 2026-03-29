/**
 * DirectoryListing
 *
 * Displays a server-generated directory index listing folders with name, last modified date, and size columns
 * Layout: Single column with a heading above a bordered table containing sortable columns and rows of folder entries
 * Category: Custom
 */

export interface DirectoryListingProps {
  /** page-title */
  pageTitle?: string;
  /** table-header-name */
  tableHeaderName?: string;
  /** table-header-last-modified */
  tableHeaderLastModified?: string;
  /** table-header-size */
  tableHeaderSize?: string;
  /** folder-row-cgi-bin */
  folderRowCgiBin?: string;
  /** folder-row-deep */
  folderRowDeep?: string;
  /** folder-row-demos */
  folderRowDemos?: string;
  /** folder-row-plugins */
  folderRowPlugins?: string;
  /** server-footer-text */
  serverFooterText?: string;
}

export function DirectoryListing(props: DirectoryListingProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">Custom</p>
        <h2 className="text-h2 text-surface-foreground mb-4">DirectoryListing</h2>
        <p className="text-body text-surface-secondary-foreground">Displays a server-generated directory index listing folders with name, last modified date, and size columns</p>
      </div>
    </section>
  );
}
