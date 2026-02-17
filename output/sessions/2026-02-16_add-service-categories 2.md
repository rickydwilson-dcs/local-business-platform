# Add Service Categories to DJ Fox Electrical

**Date**: 2026-02-16
**Task**: Add `category` field to all 48 service MDX files in `sites/dj-fox-electrical/content/services/`

## Summary

Successfully added the `category` field to all 48 service MDX files with the following distribution:

- **Installation** (34 services): New equipment, systems, and installations
- **Maintenance** (8 services): Inspections, upgrades, certifications, and rewiring
- **Repair** (6 services): Emergency callouts, fault finding, and repairs

## Implementation

Created `/tools/add-service-categories.ts` script that:

1. Maps each service filename to appropriate category based on service purpose
2. Reads MDX frontmatter and checks for existing `category` field
3. Inserts `category: "X"` before the closing `---` delimiter
4. Reports results by status (added, already exists, skipped, errors)

## Category Mappings

### Installation Services (34)

- access-control-systems, additional-circuits, additional-sockets, battery-storage-installation
- cctv-installation, commercial-fire-alarm-systems, data-network-cabling, dimmer-switch-installation
- electric-cooker-installation, electric-gates, electric-shower-installation, extractor-fan-installation
- ev-charger-installation, fire-alarm-installation, garden-lighting, intruder-alarm-installation
- led-lighting-upgrade, lighting-installation, new-build-electrical, office-fitout-electrical
- outdoor-socket-installation, security-lighting, smart-home-wiring, smart-lighting
- solar-panel-installation, storage-heater-installation, three-phase-installation, underfloor-heating-electric
- usb-socket-installation
- Plus 5 placeholder files: primary-service, secondary-service, service-three, service-four, service-five

### Maintenance Services (8)

- commercial-maintenance-contracts, consumer-unit-upgrade, electrical-safety-certificate
- emergency-lighting-testing, kitchen-bathroom-electrical, landlord-safety-package
- pat-testing, rewiring

### Repair Services (6)

- circuit-repair, emergency-electrical-callout, fault-finding
- light-switch-repair, power-outage-restoration, socket-repair

## Notes

### Placeholder Files

Found 6 placeholder/template files:

- `primary-service.mdx`, `secondary-service.mdx` (generic templates)
- `service-three.mdx`, `service-four.mdx`, `service-five.mdx` (numbered templates)
- `led-lighting-upgrade.mdx` (actual service but wasn't in original list)

These were categorized as "installation" by default. The numbered/generic template files may need to be replaced with actual service content or deleted.

### Verification

All files successfully updated:

- Run 1: Added 42 files, skipped 6
- Run 2: Added remaining 6 files, 42 already existed
- Final: All 48 files now have `category` field

Example frontmatter:

```yaml
---
title: "EV Charger Installation"
description: "Professional EV charger installation..."
keywords: ["EV charger installation", "electric car charging point"]
price_range: "£800-£1,200"
typical_duration: "3-5 hours"
category: "installation"
---
```

## Files Modified

- **Created**: `/tools/add-service-categories.ts` - Reusable script for adding categories
- **Modified**: All 48 MDX files in `sites/dj-fox-electrical/content/services/`

## Next Steps

1. Verify category field is used correctly in service listing/filtering components
2. Consider deleting or replacing placeholder service files (primary-service, secondary-service, service-three, etc.)
3. Script can be reused for other sites if they need service categorization
