package com.codeb.DTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChainSimpleDTO {
	private Long chainId;
    private String companyName;
    private String gstnNo;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private GroupSimpleDTO group;
    
}
