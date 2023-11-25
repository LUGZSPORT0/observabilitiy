const { Resource } = require("@opentelemetry/resources");
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
//Instrumentations
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
//Exporter
module.exports = (serviceName) => {
   const exporter = new JaegerExporter();
   const tracer = new NodeTracerProvider({
       resource: new Resource({
           [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
       }),
   });
  //  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
   tracer.addSpanProcessor(new BatchSpanProcessor(exporter));
   tracer.register();
   registerInstrumentations({
       instrumentations: [
           new HttpInstrumentation(),
           new ExpressInstrumentation(),
           new MongoDBInstrumentation(),
       ],
       tracerProvider: tracer,
   });
   return trace.getTracer(serviceName);
};
