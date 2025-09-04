#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes the Next.js bundle for unused JavaScript and optimization opportunities
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BUNDLE_ANALYSIS_CONFIG = {
  // Thresholds for warnings
  thresholds: {
    jsSize: 500 * 1024, // 500KB
    cssSize: 100 * 1024, // 100KB
    totalSize: 1000 * 1024, // 1MB
  },
  
  // Files to analyze
  buildDir: '.next',
  staticDir: '.next/static',
  
  // Heavy libraries to watch
  heavyLibraries: [
    'gsap',
    'framer-motion',
    'swiper',
    'lottie-react',
    'react-hook-form',
  ],
};

class BundleAnalyzer {
  constructor() {
    this.results = {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      chunks: [],
      warnings: [],
      recommendations: [],
    };
  }

  async analyze() {
    console.log('🔍 Analyzing bundle...\n');
    
    try {
      await this.analyzeStaticFiles();
      await this.analyzeChunks();
      this.generateRecommendations();
      this.printResults();
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeStaticFiles() {
    const staticPath = path.join(process.cwd(), BUNDLE_ANALYSIS_CONFIG.staticDir);
    
    if (!fs.existsSync(staticPath)) {
      console.log('⚠️  Build directory not found. Run `npm run build` first.');
      return;
    }

    const files = this.getAllFiles(staticPath);
    
    for (const file of files) {
      const stats = fs.statSync(file);
      const relativePath = path.relative(staticPath, file);
      const extension = path.extname(file);
      
      this.results.totalSize += stats.size;
      
      if (extension === '.js') {
        this.results.jsSize += stats.size;
        this.results.chunks.push({
          name: relativePath,
          size: stats.size,
          type: 'js',
        });
      } else if (extension === '.css') {
        this.results.cssSize += stats.size;
        this.results.chunks.push({
          name: relativePath,
          size: stats.size,
          type: 'css',
        });
      }
    }
  }

  async analyzeChunks() {
    // Analyze individual chunks for optimization opportunities
    const jsChunks = this.results.chunks.filter(chunk => chunk.type === 'js');
    
    for (const chunk of jsChunks) {
      // Check for heavy libraries
      for (const library of BUNDLE_ANALYSIS_CONFIG.heavyLibraries) {
        if (chunk.name.includes(library)) {
          this.results.warnings.push({
            type: 'heavy-library',
            message: `Heavy library ${library} found in ${chunk.name} (${this.formatSize(chunk.size)})`,
            chunk: chunk.name,
            library,
            size: chunk.size,
          });
        }
      }
      
      // Check for large chunks
      if (chunk.size > BUNDLE_ANALYSIS_CONFIG.thresholds.jsSize) {
        this.results.warnings.push({
          type: 'large-chunk',
          message: `Large JavaScript chunk: ${chunk.name} (${this.formatSize(chunk.size)})`,
          chunk: chunk.name,
          size: chunk.size,
        });
      }
    }
  }

  generateRecommendations() {
    // Generate optimization recommendations based on analysis
    if (this.results.jsSize > BUNDLE_ANALYSIS_CONFIG.thresholds.jsSize) {
      this.results.recommendations.push({
        type: 'code-splitting',
        message: 'Consider implementing more aggressive code splitting',
        impact: 'high',
      });
    }

    if (this.results.warnings.some(w => w.type === 'heavy-library')) {
      this.results.recommendations.push({
        type: 'dynamic-imports',
        message: 'Use dynamic imports for heavy libraries (GSAP, Framer Motion, etc.)',
        impact: 'high',
      });
    }

    if (this.results.totalSize > BUNDLE_ANALYSIS_CONFIG.thresholds.totalSize) {
      this.results.recommendations.push({
        type: 'bundle-optimization',
        message: 'Consider tree-shaking and removing unused code',
        impact: 'medium',
      });
    }

    // Add specific recommendations
    this.results.recommendations.push(
      {
        type: 'lazy-loading',
        message: 'Implement lazy loading for below-the-fold components',
        impact: 'medium',
      },
      {
        type: 'preloading',
        message: 'Use resource hints (preload, prefetch) for critical resources',
        impact: 'low',
      }
    );
  }

  printResults() {
    console.log('📊 Bundle Analysis Results\n');
    console.log('=' .repeat(50));
    
    // Size summary
    console.log('\n📦 Size Summary:');
    console.log(`Total Size: ${this.formatSize(this.results.totalSize)}`);
    console.log(`JavaScript: ${this.formatSize(this.results.jsSize)}`);
    console.log(`CSS: ${this.formatSize(this.results.cssSize)}`);
    
    // Warnings
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.results.warnings.forEach(warning => {
        console.log(`  • ${warning.message}`);
      });
    }
    
    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.results.recommendations.forEach(rec => {
        const impact = rec.impact === 'high' ? '🔴' : rec.impact === 'medium' ? '🟡' : '🟢';
        console.log(`  ${impact} ${rec.message}`);
      });
    }
    
    // Top chunks
    console.log('\n📋 Largest Chunks:');
    const topChunks = this.results.chunks
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
    
    topChunks.forEach((chunk, index) => {
      console.log(`  ${index + 1}. ${chunk.name} - ${this.formatSize(chunk.size)}`);
    });
    
    console.log('\n' + '=' .repeat(50));
  }

  getAllFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run analysis
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze();
}

module.exports = BundleAnalyzer;
