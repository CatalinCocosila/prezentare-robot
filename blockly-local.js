window.sendCommand = function(command) {
    if (window.BlocBlocklyChannel) {
        window.BlocBlocklyChannel.postMessage(command); // for flutter
    }
    // DACA SUNTEM IN IFRAME LOCAL, COMUNICAM CU PARINTELE!
    if (window.parent && window.parent.sendCommand) {
        window.parent.sendCommand(command);
    }
};

document.addEventListener("DOMContentLoaded", function() {
    console.log("Initializare");

    Blockly.Blocks['on_start'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Când apeși pe 🚀");
            this.appendStatementInput("DO")
                .setCheck(null);
            this.setColour(120);
        }
    };

    Blockly.JavaScript.forBlock['on_start'] = function(block) {
        var statements = Blockly.JavaScript.statementToCode(block, 'DO');

        var commands = statements.split("\n")        
            .map(cmd => cmd.replace(/^\s*\/\/\s?/, "").trim())
            .filter(cmd => cmd !== "")
            .join("\n");

        return `window.runCommands = function() {\n${commands}\n};\n`;
    };

    Blockly.Blocks['move_forward'] = {
        init: function() {
            this.appendDummyInput().appendField("Mergi înainte");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(230);
        }
    };
    Blockly.JavaScript.forBlock['move_forward'] = function(block) {
        return '// window.sendCommand("UP");\n';     
    };

    Blockly.Blocks['move_backward'] = {
        init: function() {
            this.appendDummyInput().appendField("Mergi înapoi");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(230);
        }
    };
    Blockly.JavaScript.forBlock['move_backward'] = function(block) {
        return '// window.sendCommand("DOWN");\n';   
    };

    Blockly.Blocks['turn_left'] = {
        init: function() {
            this.appendDummyInput().appendField("Rotire stânga");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(230);
        }
    };
    Blockly.JavaScript.forBlock['turn_left'] = function(block) {
        return '// window.sendCommand("LEFT");\n';   
    };

    Blockly.Blocks['turn_right'] = {
        init: function() {
            this.appendDummyInput().appendField("Rotire dreapta");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(230);
        }
    };
    Blockly.JavaScript.forBlock['turn_right'] = function(block) {
        return '// window.sendCommand("RIGHT");\n';  
    };

    Blockly.Blocks['repeat_n'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Repeta de")
                .appendField(new Blockly.FieldNumber(2, 1), "COUNT")
                .appendField("ori");
            this.appendStatementInput("DO")
                .setCheck(null);
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(180);
        }
    };

    Blockly.JavaScript.forBlock['repeat_n'] = function(block) {
        var count = block.getFieldValue("COUNT");    
        var statements = Blockly.JavaScript.statementToCode(block, 'DO')
            .split("\n")
            .map(cmd => cmd.trim())
            .filter(cmd => cmd !== "")
            .join("\n");

        let parent = block.getSurroundParent();      
        let isInsideOnStart = false;
        let isInsideRepeat = false;

        while (parent) {
            if (parent.type === 'on_start') {        
                isInsideOnStart = true;
                break;
            }
            if (parent.type === 'repeat_n') {        
                isInsideRepeat = true;
            }
            parent = parent.getSurroundParent();     
        }

        if (isInsideOnStart || isInsideRepeat) {     
            return `for (let i = 0; i < ${count}; i++) {\n${statements}\n}\n`;
        } else {
            return `// for (let i = 0; i < ${count}; i++) {\n${statements.split("\n").map(line => "// " + line).join("\n")}\n// }\n`;
        }
    };
    
    var workspace = Blockly.inject('blocklyDiv', {   
        toolbox: document.getElementById('toolbox'),     
        renderer: 'zelos',
        zoom: {
            controls: true,
            wheel: true,
            pinch: true
        },
        trashcan: true
    });

    console.log("Blockly este activ!");

    window.runProgram = function() {
        var code = Blockly.JavaScript.workspaceToCode(workspace);
        console.log("Cod generat:\n" + code);        

        if (code.includes("window.runCommands")) {   
            try {
                eval(code);
                window.runCommands();
            } catch (error) {
                console.error("Eroare la execuție:", error);
            }
        } else {
            console.warn("Nu există un bloc 'on start'. Comenzile nu vor fi executate!");
        }
    };
});
