const fs = require('fs');

const path = 'prisma/schema.prisma';
let schema = fs.readFileSync(path, 'utf8');

function patchModelField(modelName, fieldLine) {
  const modelRegex = new RegExp(`model\\s+${modelName}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm');
  const match = schema.match(modelRegex);
  if (!match) {
    throw new Error(`Model not found: ${modelName}`);
  }

  const block = match[0];
  const fieldName = fieldLine.trim().split(/\s+/)[0];

  if (new RegExp(`\\b${fieldName}\\b`).test(block)) {
    return;
  }

  const updated = block.replace(/\n\}$/, `\n  ${fieldLine}\n}`);
  schema = schema.replace(block, updated);
}

function patchEnumValue(enumName, value) {
  const enumRegex = new RegExp(`enum\\s+${enumName}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm');
  const match = schema.match(enumRegex);

  if (!match) {
    return false;
  }

  const block = match[0];
  if (new RegExp(`\\b${value}\\b`).test(block)) {
    return true;
  }

  const updated = block.replace(/\n\}$/, `\n  ${value}\n}`);
  schema = schema.replace(block, updated);
  return true;
}

if (!patchEnumValue('AvailabilityStatus', 'BOOKED')) {
  schema += `

enum AvailabilityStatus {
  AVAILABLE
  BOOKED
  CANCELLED
}
`;
}

if (!/enum\s+BookingStatus\s*\{/.test(schema)) {
  schema += `

enum BookingStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
}
`;
}

patchModelField('User', 'bookings Booking[]');
patchModelField('Doctor', 'bookings Booking[]');
patchModelField('AvailabilitySlot', 'bookings Booking[]');

if (!/model\s+Booking\s*\{/.test(schema)) {
  schema += `

model Booking {
  id        String        @id @default(uuid())
  patientId String
  doctorId  String
  slotId    String
  notes     String?
  status    BookingStatus @default(CONFIRMED)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  patient User             @relation(fields: [patientId], references: [id])
  doctor  Doctor           @relation(fields: [doctorId], references: [id])
  slot    AvailabilitySlot @relation(fields: [slotId], references: [id])

  @@index([patientId])
  @@index([doctorId])
  @@index([slotId])
  @@index([status])
}
`;
}

fs.writeFileSync(path, schema);
console.log('Prisma schema patched for Phase 5');
