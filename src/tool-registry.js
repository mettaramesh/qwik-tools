// src/tool-registry.js
// Map tool names to dynamic imports with postLoad hook for theme
import { Qwik } from './Qwik.js';

export const toolRegistry = {
  'base64': async () => {
    const mod = await import('./base64Tool.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'base64');
      },
      postLoad: () => {}
    };
  },
  'charset-converter': async () => {
    const mod = await import('./charsetConverterTool.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'charset-converter');
      },
      postLoad: () => {}
    };
  },
  'color-picker': async () => {
    const mod = await import('./colorPicker.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'color-picker');
      },
      postLoad: () => {}
    };
  },
  'json-formatter': async () => {
    const mod = await import('./jsonFormatter.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'json-formatter');
      },
      postLoad: () => {}
    };
  },
  'json-yaml': async () => {
    const mod = await import('./jsonYamlTool.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'json-yaml');
      },
      postLoad: () => {}
    };
  },
  'hex-viewer': async () => {
    const mod = await import('./hexViewerTool.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'hex-viewer');
      },
      postLoad: () => {}
    };
  },
  'jwt': async () => {
    const mod = await import('./jwtTool.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'jwt');
      },
      postLoad: () => {}
    };
  },
  'number-base': async () => {
    const mod = await import('./numberBaseTool.js');
    // Use default export if present
    const tool = mod.default || mod;
    return {
      render: (...args) => {
        if (typeof tool.render === 'function') return tool.render(...args);
        if (typeof mod.loadNumberBaseTool === 'function') return mod.loadNumberBaseTool(...args);
      },
      postLoad: (...args) => {
        if (typeof tool.postLoad === 'function') return tool.postLoad(...args);
        if (typeof mod.setupNumberBaseTool === 'function') return mod.setupNumberBaseTool(...args);
      }
    };
  },
  'url': async () => {
    const mod = await import('./urlTool.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'url');
      },
      postLoad: () => {
        if (mod.setupURLTool) mod.setupURLTool();
      }
    };
  },
  'json-xml': async () => {
    const mod = await import('./jsonXmlConverter.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'json-xml');
      },
      postLoad: () => {
        // setup is called inside mod.load, so nothing needed here
      }
    };
  },
  'json-validator': async () => {
    const mod = await import('./jsonValidator.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'json-validator');
      },
      postLoad: () => {
        // setup is called inside mod.load, so nothing needed here
      }
    };
  },
  'timestamp': async () => {
    const mod = await import('./timestampConverter.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.loadTimestampConverter) mod.loadTimestampConverter(toolContent);
      },
      postLoad: () => {
        if (mod.setupTimestampConverter) mod.setupTimestampConverter();
      }
    };
  },
  'cron-parser': async () => {
    const mod = await import('./cronParser.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'cron-parser');
      },
      postLoad: () => {
        // setup is called inside mod.load, so nothing needed here
      }
    };
  },
  'text-inspector': async () => {
    console.log('Loading text-inspector tool...');
    const mod = await import('./textInspectorTool.js');
    console.log('Loaded textInspectorTool.js:', mod);
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) {
          console.log('Calling mod.load for text-inspector');
          mod.load(toolContent, 'text-inspector');
        } else {
          console.error('mod.load not found in textInspectorTool.js', mod);
        }
      },
      postLoad: () => {}
    };
  },
  'text-comparer': async () => {
    const mod = await import('./textComparer.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'text-comparer');
      },
      postLoad: () => {}
    };
  },
  'xml-validator': async () => {
    const mod = await import('./xmlValidator.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'xml-validator');
      },
      postLoad: () => {
        // setup is called inside mod.load, so nothing needed here
      }
    };
  },
  'vlsm-calculator': async () => {
    const mod = await import('./vlsmCalculator.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'vlsm-calculator');
      },
      postLoad: () => {}
    };
  },
  'hash-generator': async () => {
    const mod = await import('./hashGenerator.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'hash-generator');
      },
      postLoad: () => {}
    };
  },
  'hex-ascii-converter': async () => {
    const mod = await import('./hexAsciiConverter.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'hex-ascii-converter');
      },
      postLoad: () => {}
    };
  },
  'html-entity': async () => {
    const mod = await import('./htmlEntityTool.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'html-entity');
      },
      postLoad: () => {}
    };
  },
  'image-compressor': async () => {
    const mod = await import('./imageCompressor.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'image-compressor');
      },
      postLoad: () => {}
    };
  },
  'image-converter': async () => {
    const mod = await import('./imageConverter.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'image-converter');
      },
      postLoad: () => {}
    };
  },
  'lorem-ipsum': async () => {
    const mod = await import('./loremIpsum.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'lorem-ipsum');
      },
      postLoad: () => {}
    };
  },
  'markdown-preview': async () => {
    const mod = await import('./markdownPreview.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'markdown-preview');
      },
      postLoad: () => {}
    };
  },
  // 'markdown-viewer': async () => {
  //   const mod = await import('./markdownViewer.js');
  //   return {
  //     render: () => {
  //       const toolContent = document.getElementById('tool-content');
  //       if (toolContent && mod.load) mod.load(toolContent, 'markdown-viewer');
  //     },
  //     postLoad: () => {}
  //   };
  // },
  'not-found': async () => {
    const mod = await import('./notFound.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'not-found');
      },
      postLoad: () => {}
    };
  },
  'password-generator': async () => {
    const mod = await import('./passwordGenerator.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'password-generator');
      },
      postLoad: () => {}
    };
  },
  'qr-generator': async () => {
    const mod = await import('./qrGenerator.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'qr-generator');
      },
      postLoad: () => {}
    };
  },
  'regex-tester': async () => {
    const mod = await import('./regexTester.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'regex-tester');
      },
      postLoad: () => {}
    };
  },
  'sql-formatter': async () => {
    const mod = await import('./sqlFormatter.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'sql-formatter');
      },
      postLoad: () => {}
    };
  },
  'subnet-calculator': async () => {
    const mod = await import('./subnetCalculator.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'subnet-calculator');
      },
      postLoad: () => {}
    };
  },
  'uuid-generator': async () => {
    const mod = await import('./uuidGenerator.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'uuid-generator');
      },
      postLoad: () => {}
    };
  },
  'xml-formatter': async () => {
    const mod = await import('./xmlFormatter.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, 'xml-formatter');
      },
      postLoad: () => {}
    };
  },
  // Add more tools here following the same pattern...
  '404': async (toolId) => {
    const mod = await import('./placeholderTool.js');
    return {
      render: () => {
        const toolContent = document.getElementById('tool-content');
        if (toolContent && mod.load) mod.load(toolContent, toolId);
      },
      postLoad: () => {}
    };
  },
};

// Proxy fallback: show '404' (coming soon) for any tool not in registry
export const getTool = (name) => toolRegistry[name] || toolRegistry['404'];
