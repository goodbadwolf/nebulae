-- -*- lua -*-
-- GCC 13.1.0 with wrapper script that uses patched specs for Rust/cargo builds
-- Fixes: %@ syntax errors in include (-I) and library (-L) path handling

whatis("GCC 13.1.0rs - Revised specs for Rust builds")

-- IMPORTANT: Mark this as a compiler module to properly replace gcc/13.1.0 in module list
family("compiler")

--***Start original module***--

-- Setup Modulepath for packages built by this compiler
local mroot = ("/packages/modulefiles/t2/modulefiles/")
local mdir  = pathJoin(mroot,"mpi/gcc", "13.1.0")
prepend_path("MODULEPATH", mdir)

depends_on(".spack")

execute{cmd='export RS_SPACK_CC=$CC ; export RS_SPACK_CXX=$CXX ; spack load gcc@13.1.0', modeA={'load'}}
execute{cmd='spack unload gcc@13.1.0 ; export CC=$RS_SPACK_CC ; export CXX=$RS_SPACK_CXX ; unset RS_SPACK_CC ; unset RS_SPACK_CXX', modeA={'unload'}}

local pkgName     = myModuleName()
local fullVersion = myModuleVersion()
subprocess("module-logger --user $(whoami) --package " .. pkgName .. " --version " .. fullVersion)

prepend_path("PATH","/gpfs/packages/spack/spack-rhel8/opt/spack/linux-rhel8-broadwell/gcc-8.5.0/gcc-13.1.0-pcukou32lkbpveja3uuimh2lbpjvbu2w/bin")
prepend_path("CPATH", "/gpfs/packages/spack/spack-rhel8/opt/spack/linux-rhel8-broadwell/gcc-8.5.0/gcc-13.1.0-pcukou32lkbpveja3uuimh2lbpjvbu2w/include/c++/13.1.0/x86_64-pc-linux-gnu")
prepend_path("CPATH", "/gpfs/packages/spack/spack-rhel8/opt/spack/linux-rhel8-broadwell/gcc-8.5.0/gcc-13.1.0-pcukou32lkbpveja3uuimh2lbpjvbu2w/include/c++/13.1.0")
prepend_path("LIBRARY_PATH","/gpfs/packages/spack/spack-rhel8/opt/spack/linux-rhel8-broadwell/gcc-8.5.0/gcc-13.1.0-pcukou32lkbpveja3uuimh2lbpjvbu2w/lib/gcc/x86_64-pc-linux-gnu/13.1.0")
prepend_path("LIBRARY_PATH","/gpfs/packages/spack/spack-rhel8/opt/spack/linux-rhel8-broadwell/gcc-8.5.0/gcc-13.1.0-pcukou32lkbpveja3uuimh2lbpjvbu2w/lib64")
prepend_path("LD_LIBRARY_PATH","/gpfs/packages/spack/spack-rhel8/opt/spack/linux-rhel8-broadwell/gcc-8.5.0/gcc-13.1.0-pcukou32lkbpveja3uuimh2lbpjvbu2w/lib/gcc/x86_64-pc-linux-gnu/13.1.0")
prepend_path("LD_LIBRARY_PATH","/gpfs/packages/spack/spack-rhel8/opt/spack/linux-rhel8-broadwell/gcc-8.5.0/gcc-13.1.0-pcukou32lkbpveja3uuimh2lbpjvbu2w/lib64")

--***End original module***--

-- Get module directory for our files
local moduledir = myFileName():match("(.*/)") or "./"
local files_dir = pathJoin(moduledir, "13.1.0rs-files")

-- Use wrapper script instead of direct specs in CC/CXX
-- This ensures all invocations use the patched specs
local cc_wrapper_script = pathJoin(files_dir, "rs_cc_wrapper.sh")
local cxx_wrapper_script = pathJoin(files_dir, "rs_cxx_wrapper.sh")

local before_module_load_cc = os.getenv("CC") or ""
local before_module_load_cxx = os.getenv("CXX") or ""

-- Save the original CC and CXX, and override CC and CXX to use the wrapper
-- The original CC and CXX are set by the original gcc/13.1.0 module using execute{}
-- execute{} runs at the end of a module load, so it overrides any CC/CXX set by this modulefile
-- So we have to use execute{} as well to override the one set by the original module
execute{cmd='export RS_ORIG_CC=$CC ; export RS_ORIG_CXX=$CXX ; export CC="' .. cc_wrapper_script .. '" ; export CXX="' .. cxx_wrapper_script .. '"', modeA={'load'}}
execute{cmd='unset RS_ORIG_CC ; unset RS_ORIG_CXX', modeA={'unload'}}
-- execute{cmd='unset CC ; unset CXX ; unset RS_ORIG_CC ; unset RS_ORIG_CXX', modeA={'unload'}}


-- For cargo specifically, we need to use cc_wrapper.sh
setenv("CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER", cc_wrapper_script)