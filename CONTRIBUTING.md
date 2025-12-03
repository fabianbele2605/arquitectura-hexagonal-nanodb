# Contributing to NanoDB Protocol Arena

Thank you for your interest in contributing! This project demonstrates Hexagonal Architecture with multiple protocols.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/nanodb-protocol-arena`
3. **Install dependencies**: 
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install protoc
   sudo apt-get install protobuf-compiler  # Ubuntu/Debian
   brew install protobuf                   # macOS
   
   # Install protoc plugins
   cargo install protoc-gen-prost protoc-gen-tonic
   ```
4. **Build**: `cargo build`
5. **Test**: `cargo test`
6. **Run demo**: `./demo.sh`

## 📋 Development Guidelines

### Code Style
- **Format**: `cargo fmt` before committing
- **Lint**: `cargo clippy` should pass without warnings
- **Tests**: Add tests for new functionality

### Architecture
- **Core**: Business logic in `core/` module
- **Adapters**: Protocol implementations in `server-*/`
- **Hexagonal**: Maintain separation between core and adapters

### Commit Messages
```
feat: add new protocol adapter
fix: resolve connection handling bug
docs: update API documentation
test: add integration tests
```

## 🎯 Areas for Contribution

### Easy (Good First Issues)
- [ ] Add more unit tests
- [ ] Improve error messages
- [ ] Add configuration files
- [ ] Documentation improvements

### Medium
- [ ] Add metrics endpoint
- [ ] Implement authentication
- [ ] Add connection pooling
- [ ] Performance benchmarks

### Advanced
- [ ] Add persistence layer
- [ ] Implement clustering
- [ ] Add WebSocket protocol
- [ ] Distributed consensus

## 🔧 Protocol Implementation Guide

To add a new protocol adapter:

1. **Create module**: `server-newprotocol/`
2. **Implement adapter**: Use `nanodb_core::NanoDb`
3. **Add to workspace**: Update root `Cargo.toml`
4. **Add tests**: Protocol-specific tests
5. **Update demo**: Include in `demo.sh`
6. **Document**: Update README

## 📊 Testing

```bash
# Unit tests
cargo test

# Integration tests
cargo test --test integration

# All tests with coverage
cargo test --all-features

# Demo test
./demo.sh
```

## 🤝 Pull Request Process

1. **Create branch**: `git checkout -b feature/your-feature`
2. **Make changes**: Follow guidelines above
3. **Test**: Ensure all tests pass
4. **Commit**: Use conventional commit messages
5. **Push**: `git push origin feature/your-feature`
6. **PR**: Create pull request with description

### PR Checklist
- [ ] Tests pass (`cargo test`)
- [ ] No clippy warnings (`cargo clippy`)
- [ ] Code formatted (`cargo fmt`)
- [ ] Documentation updated
- [ ] Demo script works

## 📞 Getting Help

- **Issues**: Open GitHub issue for bugs/features
- **Discussions**: Use GitHub Discussions for questions
- **Architecture**: Check existing code for patterns

## 🏆 Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in documentation

---

**Happy coding! 🦀**