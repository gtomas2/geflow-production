const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function getVersionInfo() {
    const info = {
        system: {},
        dependencies: {},
        environment: {},
        packageVersions: {}
    };

    // System Info
    try {
        info.system.node = process.version;
        info.system.npm = execSync('npm -v').toString().trim();
        
        try {
            info.system.bun = execSync('bun -v').toString().trim();
        } catch (e) {
            info.system.bun = 'Not installed';
        }

        try {
            info.system.yarn = execSync('yarn -v').toString().trim();
        } catch (e) {
            info.system.yarn = 'Not installed';
        }
    } catch (e) {
        console.error('Error getting system versions:', e.message);
    }

    // Package.json Dependencies
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        info.dependencies = {
            dependencies: packageJson.dependencies || {},
            devDependencies: packageJson.devDependencies || {}
        };

        // Extract specific important versions
        const importantPackages = {
            next: 'Next.js',
            react: 'React',
            '@clerk/nextjs': 'Clerk',
            'tailwindcss': 'Tailwind CSS',
            'typescript': 'TypeScript',
            'prisma': 'Prisma',
            '@prisma/client': 'Prisma Client',
            'zod': 'Zod',
            '@tanstack/react-query': 'React Query',
            'next-auth': 'NextAuth.js'
        };

        info.packageVersions = {};
        for (const [pkg, label] of Object.entries(importantPackages)) {
            if (packageJson.dependencies?.[pkg]) {
                info.packageVersions[label] = packageJson.dependencies[pkg];
            } else if (packageJson.devDependencies?.[pkg]) {
                info.packageVersions[label] = packageJson.devDependencies[pkg];
            }
        }
    } catch (e) {
        console.error('Error reading package.json:', e.message);
    }

    // Environment Variables (excluding sensitive data)
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            info.environment.variables = envContent
                .split('\n')
                .filter(line => line.trim() && !line.startsWith('#'))
                .map(line => line.split('=')[0])
                .filter(key => !key.toLowerCase().includes('key') && 
                             !key.toLowerCase().includes('secret') && 
                             !key.toLowerCase().includes('token'));
        }
    } catch (e) {
        console.error('Error reading .env:', e.message);
    }

    // Check for important config files
    info.configFiles = {
        'next.config.js': fs.existsSync('next.config.js'),
        'tailwind.config.js': fs.existsSync('tailwind.config.js'),
        'tsconfig.json': fs.existsSync('tsconfig.json'),
        'prisma/schema.prisma': fs.existsSync('prisma/schema.prisma'),
        '.env': fs.existsSync('.env'),
        '.env.local': fs.existsSync('.env.local')
    };

    return info;
}

function generateMarkdownReport(info) {
    let markdown = `# Project Configuration Report
Generated on: ${new Date().toLocaleString()}

## System Information
- Node.js: ${info.system.node}
- npm: ${info.system.npm}
- Bun: ${info.system.bun}
- Yarn: ${info.system.yarn}

## Key Package Versions\n`;

    for (const [pkg, version] of Object.entries(info.packageVersions)) {
        markdown += `- ${pkg}: ${version}\n`;
    }

    markdown += '\n## Configuration Files\n';
    for (const [file, exists] of Object.entries(info.configFiles)) {
        markdown += `- ${file}: ${exists ? '✅' : '❌'}\n`;
    }

    if (info.environment.variables?.length > 0) {
        markdown += '\n## Environment Variables (Names Only)\n';
        info.environment.variables.forEach(variable => {
            markdown += `- ${variable}\n`;
        });
    }

    markdown += '\n## Full Dependencies\n```json\n' + 
                JSON.stringify(info.dependencies, null, 2) + 
                '\n```\n';

    return markdown;
}

// Run the check and save to file
const info = getVersionInfo();
const report = generateMarkdownReport(info);
fs.writeFileSync('project-info.md', report);
console.log('Project information has been saved to project-info.md');

// Also display critical information in console
console.log('\nCritical Information:');
console.log('Node:', info.system.node);
console.log('Next.js:', info.packageVersions['Next.js'] || 'Not installed');
console.log('Clerk:', info.packageVersions['Clerk'] || 'Not installed');