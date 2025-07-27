-- GCC 13.1.0 with patched specs for Rust/cargo builds
-- Fixes: %@ syntax errors in include (-I) and library (-L) path handling

whatis("GCC 13.1.0 - Revised specs for Rust builds")

-- Load the original gcc/13.1.0 module
depends_on("gcc/13.1.0")

-- Get module directory for our files
local moduledir = myFileName():match("(.*/)") or "./"
local files_dir = pathJoin(moduledir, "13.1.0rs")
local specs_file = pathJoin(files_dir, "specs")

-- Get the current GCC paths
local gcc_path = os.getenv("CC") or "gcc"
local gxx_path = gcc_path:gsub("gcc$", "g++")

-- Override CC and CXX to include the fixed specs
setenv("CC", gcc_path .. " -specs=" .. specs_file)
setenv("CXX", gxx_path .. " -specs=" .. specs_file)

-- For cargo specifically, we still need to use the wrapper approach
-- since cargo doesn't always respect CC when invoking the linker
setenv("CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER", pathJoin(files_dir, "cc_wrapper.sh"))