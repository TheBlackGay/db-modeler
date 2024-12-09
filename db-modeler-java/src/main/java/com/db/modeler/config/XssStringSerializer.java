package com.db.modeler.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.owasp.encoder.Encode;

import java.io.IOException;

public class XssStringSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        if (value != null) {
            String encodedValue = Encode.forHtml(value);
            gen.writeString(encodedValue);
        }
    }
}
