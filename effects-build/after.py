import sys
sys.path.append("../../build_tools/scripts")
import base

base.configure_common_apps()
base.replaceInFile("../effects-core/deploy/effects.js", "__ATPOSTRUN__=[];", "__ATPOSTRUN__=[function(){isModuleLoaded=true;}];")
base.replaceInFile("../effects-core/deploy/effects_ie.js", "__ATPOSTRUN__=[];", "__ATPOSTRUN__=[function(){isModuleLoaded=true;}];")