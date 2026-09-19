const fs = require('fs');

const path = 'prisma/schema.prisma';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/^\s*booking\s+Booking\?\s*$/m, '');

fs.writeFileSync(path, content);
console.log('Removed old AvailabilitySlot.booking relation');
