#include <node.h>
#include <v8.h>

using namespace v8;

void hello(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
	HandleScope scope(isolate);

	if (args.Length() < 2 || !args[0]->IsString()) {
		isolate->ThrowException(Exception::TypeError(
					String::NewFromUtf8(isolate, "Wrong arguments")));
		return;
	}

	Local<Function> callback = Local<Function>::Cast(args[1]);
	Local<Value> argv[1] = {
		String::Concat(Local<String>::Cast(args[0]), String::NewFromUtf8(isolate, " world"))
	};
	callback->Call(isolate->GetCurrentContext()->Global(), 1, argv);
}

void init(Handle<Object> exports) {
	NODE_SET_METHOD(exports, "hello", hello);
}

NODE_MODULE(test, init);
