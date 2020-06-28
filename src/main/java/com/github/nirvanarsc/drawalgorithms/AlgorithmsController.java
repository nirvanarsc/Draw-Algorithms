package com.github.nirvanarsc.drawalgorithms;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AlgorithmsController {

    @GetMapping("/test")
    public String test() {
        return "Draw Algorithms";
    }
}
