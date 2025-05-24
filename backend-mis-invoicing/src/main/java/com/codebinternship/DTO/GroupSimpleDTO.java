package com.codebinternship.DTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupSimpleDTO {
	private Long id;
    private String name;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
