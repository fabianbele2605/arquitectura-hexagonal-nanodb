fn main() {
    prost_build::compile_protos(&["proto/nanodb.proto"], &["proto/"]).unwrap();
}