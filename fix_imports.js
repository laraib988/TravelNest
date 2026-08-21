const fs = require('fs');

const fixes = [
  {
    file: 'frontend/src/app/login/page.tsx',
    from: 'import { ArrowRight, ShieldCheck, Mail, Lock   Eye,\n  EyeOff,\n} from \'lucide-react\';',
    to:   'import { ArrowRight, ShieldCheck, Mail, Lock, Eye, EyeOff } from \'lucide-react\';'
  },
  {
    file: 'frontend/src/app/signup/page.tsx',
    from: 'import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck   Eye,\n  EyeOff,\n} from \'lucide-react\';',
    to:   'import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Eye, EyeOff } from \'lucide-react\';'
  },
  {
    file: 'frontend/src/app/supplier/login/page.tsx',
    from: 'import {\n  Mail,\n  Lock,\n  ArrowRight,\n  ShieldCheck,\n  Clock,\n  ArrowLeft,\n  Eye,\n  EyeOff,\n} from \'lucide-react\';',
    to:   'import {\n  Mail,\n  Lock,\n  ArrowRight,\n  ShieldCheck,\n  Clock,\n  ArrowLeft,\n  Eye,\n  EyeOff,\n} from \'lucide-react\';'
  },
  {
    file: 'frontend/src/app/supplier/signup/page.tsx',
    from: '  AlertTriangle\n  Eye,\n  EyeOff,\n} from \'lucide-react\';',
    to:   '  AlertTriangle,\n  Eye,\n  EyeOff,\n} from \'lucide-react\';'
  },
  {
    file: 'frontend/src/app/admin/login/page.tsx',
    from: 'import { Mail, Lock, ShieldCheck, ArrowRight   Eye,\n  EyeOff,\n} from \'lucide-react\';',
    to:   'import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from \'lucide-react\';'
  }
];

for (const fix of fixes) {
  let c = fs.readFileSync(fix.file, 'utf8');
  if (c.includes(fix.from)) {
    c = c.replace(fix.from, fix.to);
    fs.writeFileSync(fix.file, c);
    console.log('Fixed:', fix.file);
  } else {
    // Try to just fix the broken pattern generically
    // Pattern: "SomeIcon   Eye," -> "SomeIcon, Eye,"
    const fixed = c.replace(/(\w+)\s{3,}Eye,/g, '$1, Eye,');
    // Also fix missing comma before AlertTriangle,Eye pattern
    const fixed2 = fixed.replace(/AlertTriangle\n  Eye,/g, 'AlertTriangle,\n  Eye,');
    if (fixed2 !== c) {
      fs.writeFileSync(fix.file, fixed2);
      console.log('Regex fixed:', fix.file);
    } else {
      console.log('No change needed or pattern not found:', fix.file);
    }
  }
}
