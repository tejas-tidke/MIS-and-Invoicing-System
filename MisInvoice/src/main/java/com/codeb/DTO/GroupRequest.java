package com.codeb.DTO;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupRequest {

    @NotBlank(message = "Group name cannot be empty")
    private String name;
}
