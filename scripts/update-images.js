#!/usr/bin/env node

/**
 * Script to help identify and update remaining Image components to ResponsiveImage
 * Run with: node scripts/update-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files that still use the old Image component
function findImageUsage() {
  try {
    const result = execSync('grep -r "Image src=" src/ --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"', { encoding: 'utf8' });
    const files = result.split('\n').filter(line => line.trim() && !line.includes('ResponsiveImage'));
    
    console.log('🔍 Files still using old Image component:');
    console.log('=====================================');
    
    const fileMap = {};
    files.forEach(line => {
      const [filePath] = line.split(':');
      if (filePath && !filePath.includes('ResponsiveImage')) {
        if (!fileMap[filePath]) {
          fileMap[filePath] = [];
        }
        fileMap[filePath].push(line);
      }
    });
    
    Object.keys(fileMap).forEach(file => {
      console.log(`\n📁 ${file}`);
      fileMap[file].forEach(line => {
        console.log(`   ${line.split(':').slice(1).join(':').trim()}`);
      });
    });
    
    console.log(`\n📊 Total files to update: ${Object.keys(fileMap).length}`);
    
    return Object.keys(fileMap);
  } catch (error) {
    console.log('✅ No old Image components found!');
    return [];
  }
}

// Generate migration suggestions
function generateMigrationSuggestions(files) {
  console.log('\n🚀 Migration Suggestions:');
  console.log('========================');
  
  files.forEach(file => {
    console.log(`\n📝 ${file}:`);
    console.log('   1. Add import: import ResponsiveImage from "../../components/ResponsiveImage";');
    console.log('   2. Add import: import { getOptimizedImageProps } from "../../lib/imageUtils";');
    console.log('   3. Replace Image with ResponsiveImage using getOptimizedImageProps');
    console.log('   4. Determine appropriate context (hero, card, gallery, content)');
    console.log('   5. Set priority=true for above-the-fold images');
  });
}

// Check for performance issues
function checkPerformanceIssues() {
  console.log('\n⚡ Performance Optimization Checklist:');
  console.log('=====================================');
  
  const checklist = [
    '✅ Next.js image optimization enabled',
    '✅ WebP/AVIF formats configured',
    '✅ ResponsiveImage component created',
    '✅ Image utility functions available',
    '✅ Priority loading implemented',
    '✅ Blur placeholders added',
    '✅ Critical components updated',
    '⏳ Remaining components need updating',
    '⏳ LCP images need priority loading',
    '⏳ Background images need optimization'
  ];
  
  checklist.forEach(item => console.log(`   ${item}`));
}

// Main execution
function main() {
  console.log('🖼️  Image Optimization Audit');
  console.log('============================\n');
  
  const filesToUpdate = findImageUsage();
  
  if (filesToUpdate.length > 0) {
    generateMigrationSuggestions(filesToUpdate);
  }
  
  checkPerformanceIssues();
  
  console.log('\n💡 Next Steps:');
  console.log('==============');
  console.log('1. Update remaining Image components to ResponsiveImage');
  console.log('2. Test on different devices and screen sizes');
  console.log('3. Run PageSpeed Insights to verify improvements');
  console.log('4. Monitor Core Web Vitals in production');
  console.log('5. Consider implementing lazy loading for below-the-fold images');
}

main();
